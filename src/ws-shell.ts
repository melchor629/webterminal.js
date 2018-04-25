import { Shell, Command, WebTerminal } from ".";
import { Writable, Readable } from "stream";
import { ShellOptions } from "./shell";

export class WSShell extends Shell {
    env: Map<String, String>;
    commands: () => Map<String, Command>;

    private url: string;
    private secure: boolean;
    private ws: WebSocket;
    private received = Buffer.alloc(1, 0);

    constructor(options: ShellOptions & { url: string, secure?: boolean }) {
        super(options);
        this.url = options.url;
        this.secure = options.secure !== undefined ? !!options.secure! : true;
    }

    async attached(wt: WebTerminal) {
        this.ws = new WebSocket(`${this.secure ? 'wss' : 'ws'}://${this.url}/`);
        this.ws.addEventListener('message', (ev) => {
            wt.stdout.write(ev.data);
            this.received = Buffer.concat([this.received, new Buffer(ev.data)]);
        });
        wt.stdin.on('data', data => this.ws.send(data));
        wt.on('resize', () => {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            fetch(`${this.secure ? 'https' : 'http'}://${this.url}/resize`, {
                body: JSON.stringify({ cols: wt.cols, rows: wt.rows }),
                method: 'POST',
                headers
            }).catch();
        });
    }

    private download() {
        const blob = new Blob([this.received.toString('utf-8')]);
        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', 'wt.bin');
        link.click();
    }
}