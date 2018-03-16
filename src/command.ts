import { Readable, Writable } from 'stream';

export interface CommandEnv {
    stdin: Readable;
    stdout: Writable;
    stderr: Writable;
    env: Map<String, String>;
};

export interface Command {
    name: string;
    execute(proc: CommandEnv, ...args: string[]): number;
};
