"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = exports.commandRunner = exports.chalk = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.chalk = chalk_1.default;
const commander_1 = require("commander");
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("./commons");
__exportStar(require("commander"), exports);
const commandRunner = (name) => async (options) => {
    const ctx = (0, pinion_1.getContext)({
        ...options
    });
    await (0, pinion_1.generator)(ctx)
        .then((0, pinion_1.runGenerator)(__dirname, name, 'index'))
        .catch((error) => {
        const { logger } = ctx.pinion;
        logger.error(`Error: ${chalk_1.default.white(error.message)}`);
    });
};
exports.commandRunner = commandRunner;
exports.program = new commander_1.Command();
exports.program
    .name('feathers')
    .description('The Feathers command line interface 🕊️')
    .version(commons_1.version)
    .showHelpAfterError();
const generate = exports.program.command('generate').alias('g');
generate
    .command('app')
    .description('Generate a new application')
    .option('--name <name>', 'The name of the application')
    .action((0, exports.commandRunner)('app'));
generate
    .command('service')
    .description('Generate a new service')
    .option('--name <name>', 'The service name')
    .option('--path <path>', 'The path to register the service on')
    .option('--type <type>', 'The service type (knex, mongodb, custom)')
    .action((0, exports.commandRunner)('service'));
generate
    .command('hook')
    .description('Generate a hook')
    .option('--name <name>', 'The name of the hook')
    .option('--type <type>', 'The hook type (around or regular)')
    .action((0, exports.commandRunner)('hook'));
generate
    .command('connection')
    .description('Add a new database connection')
    .action((0, exports.commandRunner)('connection'));
generate
    .command('authentication')
    .description('Add authentication to the application')
    .action((0, exports.commandRunner)('authentication'));
generate.description(`Run a generator. Currently available: \n  ${generate.commands
    .map((cmd) => `${chalk_1.default.blue(cmd.name())}: ${cmd.description()} `)
    .join('\n  ')}`);
//# sourceMappingURL=cli.js.map