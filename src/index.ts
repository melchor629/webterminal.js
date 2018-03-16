export { WebTerminal, WebTerminalOptions } from "./webterminal";
export { Shell } from './shell';
export { Command, CommandEnv } from './command';

import { WebTerminal } from './webterminal';

window['WebTerminal'] = WebTerminal;
