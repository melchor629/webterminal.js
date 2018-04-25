export { WebTerminal, WebTerminalOptions } from "./webterminal";
export { Shell, ShellOptions } from './shell';
export { Command, CommandEnv } from './command';
export { BasicShell } from './basic-shell';
export { WSShell } from './ws-shell';

import { WebTerminal } from './webterminal';
import { Shell } from './shell';
import { BasicShell } from './basic-shell';
import { WSShell } from './ws-shell';

window['WebTerminal'] = WebTerminal;
window['WebTerminal'].Shell = Shell;
window['WebTerminal'].BasicShell = BasicShell;
window['WebTerminal'].WSShell = WSShell;
