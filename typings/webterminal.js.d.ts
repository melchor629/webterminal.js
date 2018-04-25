import { ITerminalOptions } from "xterm";
import { EventEmitter } from "events";
import { Readable, Writable } from "stream";

declare module 'webterminal.js' {
    interface WebTerminalOptions extends ITerminalOptions {
        /**
         * An array or Map of commands to add initially.
         */
        commands?: Command[] | Map<String, Command>;
    }

    /**
     * The webterminal. Shows a terminal where you want.
     */
    class WebTerminal extends EventEmitter {
        constructor(elem: HTMLElement, options: WebTerminalOptions);
        addCommand(...commands: Command[]): void;
        attach(shell: Shell): void;
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

    export interface ShellOptions {
        /**
         * Extra environment variables. You can add `$USER` and modify `$PS1`.
         * For `$PS1`, see the shell documentation about formatting.
         */
        env?: Map<String, String> | any;
    }

    abstract class Shell {
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
         */
        attached(): void;

        constructor(options: ShellOptions);
    }

    /**
     * xD
     */
    class BasicShell extends Shell {}

    /**
     * Shell that connects to an API and a WebSocket to redirect all the user's input to a shell hosted
     * in the server.
     *
     * The server must implement the following API, in its base route:
     *
     *   - `WS .../` Creates a connection to the remote shell using the identification from before.
     *   - `POST .../resize` Sends a json `{"cols": ..., "rows": ...}` to notify that the terminal was resized.
     *
     * It's up to you the way the shell is created, but when it's created, pass a valid URL to WSShel and
     * create the terminal.
     */
    class WSShell extends Shell {
        /**
         * Creates a new shell that will connect to a WebSocket where a shell can be found.
         * @param url The URL (without http or https) to the server where the API is found
         * @param secure True to use HTTPS, false to use HTTP. Set true by default.
         */
        constructor(options: ShellOptions & { url: string, secure?: boolean });
    }
}