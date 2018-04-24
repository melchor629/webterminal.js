import { Shell, Command, WebTerminal } from ".";
import { Writable, Readable } from "stream";

export class WSShell implements Shell {
    env: Map<String, String> = new Map();
    stdout: Writable;
    stderr: Writable;
    stdin: Readable;
    commands: () => Map<String, Command>;

    private ws: WebSocket;
    private received = Buffer.alloc(1, 0);

    constructor(private url: string, private secure: boolean = true) {}

    async attached(wt: WebTerminal) {
        this.ws = new WebSocket(`${this.secure ? 'wss' : 'ws'}://${this.url}/`);
        this.ws.addEventListener('message', (ev) => {
            this.stdout.write(ev.data);
            this.received = Buffer.concat([this.received, new Buffer(ev.data)]);
        });
        this.stdin.on('data', data => this.ws.send(data));
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