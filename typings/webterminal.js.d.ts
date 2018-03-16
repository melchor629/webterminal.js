import { ITerminalOptions } from "xterm";
import { EventEmitter } from "events";
import { Readable, Writable } from "stream";

declare module 'webterminal.js' {
    interface WebTerminalOptions extends ITerminalOptions {
        /**
         * An array or Map of commands to add initially.
         */
        commands?: Command[] | Map<String, Command>,
        /**
         * The shell to be used. If null, will use BasicShell.
         */
        shell?: Shell,
        /**
         * Extra environment variables. You can add `$USER` and modify `$PS1`.
         * For `$PS1`, see the shell documentation about formatting.
         */
        env?: Map<String, String> | any
    }

    /**
     * The webterminal. Shows a terminal where you want.
     */
    class WebTerminal extends EventEmitter {
        constructor(elem: HTMLElement, options: WebTerminalOptions);
        addCommand(...commands: Command[]): void;
        stdin: Readable;
        stdout: Writable;
        stderr: Writable;
    }

    interface CommandEnv {
        stdin: Readable;
        stdout: Writable;
        stderr: Writable;
        env: Map<String, String>;
    }

    interface Command {
        name: string;
        execute(proc: CommandEnv, ...args: string[]): number;
    }

    interface Shell {
        /**
         * The environment variables that will hold the shell, which the subprocesses will inherit.
         * The constructor of the shell must initialize the variable. The terminal will add the
         * following variables: COLORTERM, TERM, LOCALE, LC_CTYPE. You should add, at least SHELL.
         */
        env: Map<String, String>;
        /**
         * A reference to the terminal's `stdout`
         */
        stdout: Writable;
        /**
         * A reference to the terminal's `stderr`
         */
        stderr: Writable;
        /**
         * A reference to the terminal's `stdin`
         */
        stdin: Readable;
        /**
         * A getter to obtain the current commands added to WebTerminal
         */
        commands: () => Map<String, Command>;
        /**
         * WebTerminal notifies the shell that has been attached an can start doing its work.
         * In general, the shell should listen for `stdin` now.
         */
        attached(): void;
    }

    /**
     * xD
     */
    class BasicShell implements Shell {
        /**
         * The environment variables that will hold the shell, which the subprocesses will inherit.
         * The constructor of the shell must initialize the variable. The terminal will add the
         * following variables: COLORTERM, TERM, LOCALE, LC_CTYPE. You should add, at least SHELL.
         */
        env: Map<String, String>;
        /**
         * A reference to the terminal's `stdout`
         */
        stdout: Writable;
        /**
         * A reference to the terminal's `stderr`
         */
        stderr: Writable;
        /**
         * A reference to the terminal's `stdin`
         */
        stdin: Readable;
        /**
         * A getter to obtain the current commands added to WebTerminal
         */
        commands: () => Map<String, Command>;
        /**
         * WebTerminal notifies the shell that has been attached an can start doing its work.
         * In general, the shell should listen for `stdin` now.
         */
        attached(): void;
    }
}