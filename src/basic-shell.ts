import { Writable, Readable } from "stream";
import { Shell } from "./shell";
import { Command } from "./command";

export class BasicShell implements Shell {
    env: Map<String, String>;
    stdout: Writable;
    stderr: Writable;
    stdin: Readable;
    commands: () => Map<String, Command>;

    private history: string[];
    private lastStatusCode = 0;

    constructor() {
        this.env = new Map();
        this.env.set('SHELL', '/bin/basic-shell');
        this.history = JSON.parse(window.localStorage.getItem('webterminal.js:bs:history') || '[]');
    }

    attached() {
        this.process();
    }

    private async process() {
        let line;
        while(line !== null) {
            this.stdout.write(this.getPrompt());
            line = await this.readline();
            if(line) {
                let args = this.parseLine(line);
                let cmd = this.commands().get(args[0]);
                if(cmd) {
                    this.lastStatusCode = cmd.execute({
                        stdin: this.stdin,
                        stdout: this.stdout,
                        stderr: this.stderr,
                        env: this.env
                    }, ...args) || 0;
                } else {
                    this.stderr.write(`bs: command not found: ${args[0]}\r\n`);
                    this.lastStatusCode = 127;
                }
            }
        }
        this.stdout.write('\r\nThe shell has closed...\r\n');
    }

    private readline(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let cursor = 0, history = -1;
            let line = '';
            let escapeCode = false;
            let rektParen = false;
            let somethingThatWillBeCalled: (data: string | Buffer) => void;
            const resolved = (s: string) => {
                this.stdin.removeListener('data', somethingThatWillBeCalled);
                resolve(s);
            };
            somethingThatWillBeCalled = (data: string | Buffer) => {
                for(let i = 0; i < data.length; i++) {
                    let char = typeof data === 'string' ? data.charCodeAt(i) : data.readUInt8(i);
                    if(!escapeCode) {
                        if(char === 27) {
                            escapeCode = true;
                        } else if(char === 127) { //Backspace
                            if(cursor > 0) {
                                if(cursor < line.length) {
                                    //Deleting in the middle of the line
                                    line = line.substr(0, cursor) + line.substr(cursor + 1);
                                } else {
                                    //Deleting at the end of the string
                                    line = line.substr(0, cursor - 1);
                                }

                                cursor--;
                                this.moveCursorLeft(cursor + 1);
                                this.stdout.write(`${line} `);
                                this.moveCursorLeft(line.length - cursor + 1);
                            }
                        } else if(char >= 32) {
                            //Insert character where the cursor is
                            line = line.substr(0, cursor) + String.fromCharCode(char) + line.substr(cursor);
                            cursor++;
                            if(cursor > 1) this.moveCursorLeft(cursor - 1);
                            this.stdout.write(line);
                            if(cursor < line.length) this.moveCursorLeft(line.length - cursor);
                        } else if(char === 10 || char === 13) { // \n
                            this.stdout.write('\r\n');
                            resolved(line);
                            this.appendHistory(line);
                        } else if(char === 4 && line.length === 0) { //EOF
                            resolved(null);
                        }
                    } else {
                        if(!rektParen) {
                            if(char === 91) {
                                rektParen = true;
                            }
                        } else {
                            if(char === 67 && cursor < line.length) {
                                this.moveCursorRight();
                                cursor++;
                            } else if(char === 68 && cursor > 0) {
                                this.moveCursorLeft();
                                cursor--;
                            } else if(char === 65 && history + 1 < this.history.length) {
                                history++;
                                let cmd = this.history[history];
                                //Put the cursor at the beginning of the prompt
                                this.moveCursorLeft(cursor);
                                //Calculate the difference between the before command to the new
                                //just in case we must clean up a bit
                                let a = Math.max(0, line.length - cmd.length);
                                //Write the command
                                this.stdout.write(cmd);
                                //Clean up
                                for(let i = 0; i < a; i++) this.stdout.write(' ');
                                cursor = cmd.length;
                                //Move the cursor to the end of the command
                                this.moveCursorLeft(a);
                                //Replace the old history position
                                if(history > 0) this.replaceHistory(history - 1, line);
                                //Change the line
                                line = cmd;
                            } else if(char === 66) {
                                if(history > 0) {
                                    history--;
                                    let cmd = this.history[history];
                                    //Put the cursor at the beginning of the prompt
                                    this.moveCursorLeft(cursor);
                                    //Calculate the difference between the before command to the new
                                    //just in case we must clean up a bit
                                    let a = Math.max(0, line.length - cmd.length);
                                    //Write the command
                                    this.stdout.write(cmd);
                                    //Clean up
                                    this.stdout.write(Buffer.alloc(a, ' '));
                                    cursor = cmd.length;
                                    //Move the cursor to the end of the command
                                    this.moveCursorLeft(a);
                                    //Replace the old history position
                                    this.replaceHistory(history - 1, line);
                                    //Change the line
                                    line = cmd;
                                } else if(history === 0) {
                                    //Erase everything writen
                                    this.moveCursorLeft(cursor);
                                    this.stdout.write(Buffer.alloc(line.length, ' '));
                                    this.moveCursorLeft(line.length);
                                    cursor = 0;

                                    //Replace the old history position
                                    this.replaceHistory(history, line);
                                    line = '';
                                    history--;
                                }
                            }
                            escapeCode = rektParen = false;
                        }
                    }
                }
            };
            this.stdin.on('data', somethingThatWillBeCalled);
        });
    }

    private getPrompt(): string {
        if(this.env.get('PS1')) {
            let prompt = <string>this.env.get('PS1');
            prompt = prompt.replace(/%h/g, window.location.host);
            prompt = prompt.replace(/%u/g, <string>this.env.get('USER') || 'anon');
            prompt = prompt.replace(/%scc/g, this.lastStatusCode === 0 ? '\x1B[32m' : '\x1B[31m');
            prompt = prompt.replace(/%sc/g, this.lastStatusCode.toString());
            return prompt;
        } else {
            let user = this.env.get('USER') || 'anon';
            return `\x1B[96m${user}\x1B[0m@\x1B[93m${window.location.host}\x1B[0m $ `;
        }
    }

    private moveCursorRight(num: number = 1) {
        if(num > 0) this.stdout.write(`\x1B[${num}C`);
    }

    private moveCursorLeft(num: number = 1) {
        if(num > 0) this.stdout.write(`\x1B[${num}D`);
    }

    private appendHistory(cmd: string) {
        if(this.history.length > 100) {
            this.history = this.history.slice(0, 99);
        }
        this.history.unshift(cmd);
        window.localStorage.setItem('webterminal.js:bs:history', JSON.stringify(this.history));
    }

    private replaceHistory(pos: number, cmd: string) {
        if(pos < 100 && pos < this.history.length) {
            this.history[pos] = cmd;
            window.localStorage.setItem('webterminal.js:bs:history', JSON.stringify(this.history));
        }
    }

    private parseLine(line: string): string[] {
        //TODO Better parser, right how something like: \"jaj\" is not possible
        let args: string[] = line.match(/([^ "']+|".{1,}?"|'.{1,}?')/g);
        for(let i = 0; i < args.length; i++) {
            if(args[i].charAt(0) === '"' || args[i].charAt(0) === "'") args[i] = args[i].substring(1, args[i].length - 1);
            if(args[i].charAt(0) !== "'") {
                const vars = args[i].match(/\$([a-zA-Z][a-zA-Z0-9_\-]+)/g);
                for(let o = 0; o < (vars ? vars.length : 0); o++) {
                    args[i] = args[i].replace(vars[o], <string>this.env.get(vars[o].substr(1)) || '');
                }
            }
        }
        return args;
    }

}