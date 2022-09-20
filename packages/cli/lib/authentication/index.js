"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.prompts = void 0;
const chalk_1 = __importDefault(require("chalk"));
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../commons");
const index_1 = require("../service/index");
const prompts = (ctx) => [
    {
        type: 'checkbox',
        name: 'authStrategies',
        when: !ctx.authStrategies,
        message: 'Which authentication methods do you want to use?',
        suffix: chalk_1.default.grey(' Other methods and providers can be added at any time.'),
        choices: [
            {
                name: 'Email + Password',
                value: 'local',
                checked: true
            },
            {
                name: 'Google',
                value: 'google'
            },
            {
                name: 'Facebook',
                value: 'facebook'
            },
            {
                name: 'Twitter',
                value: 'twitter'
            },
            {
                name: 'GitHub',
                value: 'github'
            },
            {
                name: 'Auth0',
                value: 'auth0'
            }
        ]
    },
    {
        name: 'service',
        type: 'input',
        when: !ctx.service,
        message: 'What is your authentication service name?',
        default: 'users'
    },
    {
        name: 'entity',
        type: 'input',
        when: !ctx.entity,
        message: 'What is your authenticated entity name?',
        suffix: chalk_1.default.grey(' Will be available in params (e.g. params.user)'),
        default: 'user'
    }
];
exports.prompts = prompts;
const generate = (ctx) => (0, pinion_1.generator)(ctx)
    .then((0, commons_1.initializeBaseContext)())
    .then((0, commons_1.checkPreconditions)())
    .then((0, pinion_1.prompt)(exports.prompts))
    .then(async (ctx) => {
    var _a;
    const serviceContext = await (0, index_1.generate)({
        ...ctx,
        name: ctx.service,
        path: ctx.service,
        isEntityService: true,
        type: (0, commons_1.getDatabaseAdapter)((_a = ctx.feathers) === null || _a === void 0 ? void 0 : _a.database)
    });
    return {
        ...ctx,
        ...serviceContext
    };
})
    .then((0, pinion_1.runGenerators)(__dirname, 'templates'))
    .then((ctx) => {
    const dependencies = [];
    dependencies.push('@feathersjs/authentication-oauth');
    if (ctx.authStrategies.includes('local')) {
        dependencies.push('@feathersjs/authentication-local');
    }
    if (ctx.dependencies) {
        return {
            ...ctx,
            dependencies: [...ctx.dependencies, ...dependencies]
        };
    }
    return (0, pinion_1.install)((0, commons_1.addVersions)(dependencies, ctx.dependencyVersions), false, ctx.feathers.packager)(ctx);
});
exports.generate = generate;
//# sourceMappingURL=index.js.map