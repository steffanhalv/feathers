"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const path_1 = require("path");
const chalk_1 = __importDefault(require("chalk"));
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../commons");
const authentication_1 = require("../authentication");
const connection_1 = require("../connection");
const generate = (ctx) => (0, pinion_1.generator)(ctx)
    .then((0, commons_1.initializeBaseContext)())
    .then((ctx) => ({
    ...ctx,
    dependencies: [],
    devDependencies: []
}))
    .then((0, pinion_1.prompt)((ctx) => [
    {
        name: 'language',
        type: 'list',
        message: 'Do you want to use JavaScript or TypeScript?',
        when: !ctx.language,
        choices: [
            { name: 'TypeScript', value: 'ts' },
            { name: 'JavaScript', value: 'js' }
        ]
    },
    {
        name: 'name',
        type: 'input',
        when: !ctx.name,
        message: 'What is the name of your application?',
        default: ctx.cwd.split(path_1.sep).pop()
    },
    {
        name: 'description',
        type: 'input',
        when: !ctx.description,
        message: 'Write a short description'
    },
    {
        type: 'list',
        name: 'framework',
        when: !ctx.framework,
        message: 'Which HTTP framework do you want to use?',
        choices: [
            { value: 'koa', name: `KoaJS ${chalk_1.default.grey('(recommended)')}` },
            { value: 'express', name: 'Express' }
        ]
    },
    {
        type: 'checkbox',
        name: 'transports',
        when: !ctx.transports,
        message: 'What APIs do you want to offer?',
        choices: [
            { value: 'rest', name: 'HTTP (REST)', checked: true },
            { value: 'websockets', name: 'Real-time', checked: true }
        ]
    },
    {
        name: 'packager',
        type: 'list',
        when: !ctx.packager,
        message: 'Which package manager are you using?',
        choices: [
            { value: 'npm', name: 'npm' },
            { value: 'yarn', name: 'Yarn' },
            { value: 'pnpm', name: 'pnpm' }
        ]
    },
    ...(0, connection_1.prompts)(ctx),
    ...(0, authentication_1.prompts)({
        ...ctx,
        service: 'users',
        entity: 'user'
    })
]))
    .then((0, pinion_1.runGenerators)(__dirname, 'templates'))
    .then((0, pinion_1.copyFiles)((0, pinion_1.fromFile)(__dirname, 'static'), (0, pinion_1.toFile)('.')))
    .then((0, commons_1.initializeBaseContext)())
    .then((0, pinion_1.when)(({ authStrategies }) => authStrategies.length > 0, async (ctx) => {
    const { dependencies } = await (0, connection_1.generate)(ctx);
    return {
        ...ctx,
        dependencies
    };
}))
    .then((0, pinion_1.when)(({ authStrategies }) => authStrategies.length > 0, async (ctx) => {
    const { dependencies } = await (0, authentication_1.generate)({
        ...ctx,
        service: 'users',
        entity: 'user'
    });
    return {
        ...ctx,
        dependencies
    };
}))
    .then((0, pinion_1.install)(({ transports, framework, dependencyVersions, dependencies }) => {
    const hasSocketio = transports.includes('websockets');
    dependencies.push('@feathersjs/feathers', '@feathersjs/errors', '@feathersjs/schema', '@feathersjs/configuration', '@feathersjs/transport-commons', '@feathersjs/authentication', 'winston');
    if (hasSocketio) {
        dependencies.push('@feathersjs/socketio');
    }
    if (framework === 'koa') {
        dependencies.push('@feathersjs/koa', 'koa-static');
    }
    if (framework === 'express') {
        dependencies.push('@feathersjs/express', 'compression');
    }
    return (0, commons_1.addVersions)(dependencies, dependencyVersions);
}, false, ctx.packager))
    .then((0, pinion_1.install)(({ language, framework, devDependencies, dependencyVersions }) => {
    devDependencies.push('nodemon', 'axios', 'mocha', 'cross-env', 'prettier', '@feathersjs/cli');
    if (language === 'ts') {
        devDependencies.push('@types/mocha', framework === 'koa' ? '@types/koa-static' : '@types/compression', '@types/node', 'nodemon', 'ts-node', 'typescript', 'shx');
    }
    return (0, commons_1.addVersions)(devDependencies, dependencyVersions);
}, true, ctx.packager));
exports.generate = generate;
//# sourceMappingURL=index.js.map