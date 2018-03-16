import { Readable, Writable } from "stream";
import { Command } from "./command";

export interface Shell {
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
};
