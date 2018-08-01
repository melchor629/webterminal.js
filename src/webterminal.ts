import { Terminal, ITerminalOptions } from 'xterm';
import { EventEmitter } from 'events';
import { Readable, Writable } from 'stream';
import { Command } from './command';
import { Shell } from './shell';
import '../node_modules/xterm/dist/xterm.css';
const WebfontLoader = require('xterm-webfont');

//https://github.com/xtermjs/xterm.js
Terminal.applyAddon(WebfontLoader);

const outWriteImpl = function(chunk: string | Buffer, encoding: string, callback: Function) {
    if(typeof chunk === 'string') {
        this.xterm.write(chunk);
    } else {
        this.xterm.write(chunk.toString('utf-8'));
    }
    if(callback) callback();
};

export interface WebTerminalOptions extends ITerminalOptions {
    /**
     * An array or Map of commands to add initially.
     */
    commands?: Command[] | Map<String, Command>;
};

export class WebTerminal extends EventEmitter {
    private xterm: Terminal;
    private commands: Map<String, Command> = new Map<String, Command>();
    private shell: Shell;
    private _stdout = new Writable({
        write: outWriteImpl.bind(this)
    });
    private _stderr = new Writable({
        write: outWriteImpl.bind(this)
    });
    private _stdin = new Readable({
        read: () => {},
    });

    constructor(private elem: HTMLElement, options: WebTerminalOptions) {
        super();
        this.xterm = new Terminal(options);
        this.xterm.on('data', data => this._stdin.push(data));
        this.xterm.on('title', title => this.emit('title', title));

        if(options.commands) {
            if(options.commands instanceof Map) {
                options.commands.forEach((command, name) => this.commands.set(name, command));
            } else if(Array.isArray(options.commands)) {
                options.commands.forEach((command) => this.commands.set(command.name, command));
            } else {
                for(let name in (options.commands as any)) this.commands.set(name, { name, execute: options.commands[name] });
            }
        }

        if(options['debug']) this.xterm.setOption('debug', true);

        this.xterm['loadWebfontAndOpen'](this.elem);
    }

    public addCommand(...commands: Command[]) {
        commands.forEach(command => this.commands.set(command.name, command));
    }

    public attach(shell: Shell) {
        if(this.shell) throw new Error("Shell already attached");
        this.shell = shell;

        //Prepare the shell with the corresponding references
        this.shell.commands = () => this.commands;
        this.shell.env.set('COLORTERM', 'truecolor');
        this.shell.env.set('TERM', 'xterm-256color');
        this.shell.env.set('LANG', `${navigator.language || navigator['userLanguage']}.UTF-8`);
        this.shell.env.set('LC_CTYPE', this.shell.env.get('LANG'));

        this.shell.attached(this);console.log(this.xterm);
    }

    public get stdin(): Readable { return this._stdin; }
    public get stdout(): Writable { return this._stdout; }
    public get stderr(): Writable { return this._stderr; }

    public get cols(): number { return this.xterm.getOption('cols'); }
    public get rows(): number { return this.xterm.getOption('rows'); }
    public get col(): number { return this.xterm['_core'].buffers.active.x; }
    public get row(): number { return this.xterm['_core'].buffers.active.y; }

}