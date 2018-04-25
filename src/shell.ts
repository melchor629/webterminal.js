import { Readable, Writable } from "stream";
import { Command } from "./command";
import { WebTerminal } from ".";

export interface ShellOptions {
    /**
     * Extra environment variables. You can add `$USER` and modify `$PS1`.
     * For `$PS1`, see the shell documentation about formatting.
     */
    env?: Map<String, String> | any;
}

export abstract class Shell {
    /**
     * The environment variables that will hold the shell, which the subprocesses will inherit.
     * The constructor of the shell must initialize the variable. The terminal will add the
     * following variables: COLORTERM, TERM, LOCALE, LC_CTYPE. You should add, at least SHELL.
     */
    env: Map<String, String>;
    /**
     * A getter to obtain the current commands added to WebTerminal
     */
    commands: () => Map<String, Command>;
    /**
     * WebTerminal notifies the shell that has been attached an can start doing its work.
     * In general, the shell should listen for `stdin` now.
     * @param wt A WebTerminal reference
     */
    abstract attached(wt: WebTerminal): void;

    constructor(options: ShellOptions) {
        this.env = new Map();
        if(options.env) {
            if(options.env instanceof Map) {
                options.env.forEach((value, key) => this.env.set(key, value));
            } else {
                Object['entries'](options.env).forEach((pair: [string, string]) => this.env.set(pair[0], pair[1]));
            }
        }
    }
};
