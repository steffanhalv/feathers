"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const lodash_1 = __importDefault(require("lodash"));
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../commons");
const generate = (ctx) => (0, pinion_1.generator)(ctx)
    .then((0, commons_1.initializeBaseContext)())
    .then((0, commons_1.checkPreconditions)())
    .then((0, pinion_1.prompt)(({ name, path, type, authentication, isEntityService }) => {
    var _a;
    return [
        {
            name: 'name',
            type: 'input',
            when: !name,
            message: 'What is the name of your service?'
        },
        {
            name: 'path',
            type: 'input',
            when: !path,
            message: 'Which path should the service be registered on?',
            default: (answers) => `${lodash_1.default.kebabCase(answers.name)}`
        },
        {
            name: 'authentication',
            type: 'confirm',
            when: authentication === undefined && !isEntityService,
            message: 'Does this service require authentication?'
        },
        {
            name: 'type',
            type: 'list',
            when: !type,
            message: 'What kind of service is it?',
            default: (0, commons_1.getDatabaseAdapter)((_a = ctx.feathers) === null || _a === void 0 ? void 0 : _a.database),
            choices: [
                {
                    value: 'knex',
                    name: 'SQL'
                },
                {
                    value: 'mongodb',
                    name: 'MongoDB'
                },
                {
                    value: 'custom',
                    name: 'A custom service'
                }
            ]
        }
    ];
}))
    .then(async (ctx) => {
    const { name, path, type } = ctx;
    const kebabName = lodash_1.default.kebabCase(name);
    const camelName = lodash_1.default.camelCase(name);
    const upperName = lodash_1.default.upperFirst(camelName);
    const className = `${upperName}Service`;
    const folder = path.split('/').filter((el) => el !== '');
    const relative = ['', ...folder].map(() => '..').join('/');
    const fileName = lodash_1.default.last(folder);
    return {
        name,
        type,
        path,
        folder,
        fileName,
        upperName,
        className,
        kebabName,
        camelName,
        relative,
        ...ctx
    };
})
    .then((0, pinion_1.runGenerators)(__dirname, 'templates'))
    .then((0, pinion_1.runGenerator)(__dirname, 'type', ({ type }) => `${type}.tpl`));
exports.generate = generate;
//# sourceMappingURL=index.js.map