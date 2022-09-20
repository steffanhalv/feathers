"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({}) => `import { createLogger, format, transports } from 'winston'
import type { HookContext, NextFunction } from './declarations'

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'info',
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.Console()
  ]
})

export const logErrorHook = async (context: HookContext, next: NextFunction) => {
  try {
    await next()
  } catch (error) {
    logger.error(error)
    throw error
  }
}
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib }) => lib, 'logger')));
exports.generate = generate;
//# sourceMappingURL=logger.tpl.js.map