"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({ camelName, upperName, fileName, isEntityService, authentication }) => `import { resolveAll } from '@feathersjs/schema'
${isEntityService || authentication ? `import { authenticate } from '@feathersjs/authentication'` : ''}
import type {
  ${upperName}Data,
  ${upperName}Result,
  ${upperName}Query,
} from './${fileName}.schema'
import { ${camelName}Resolvers } from './${fileName}.resolver'

export const ${camelName}Hooks = {
  around: {
    all: [${authentication
    ? `
      authenticate('jwt'),`
    : ''} ${!isEntityService
    ? `
      resolveAll(${camelName}Resolvers)`
    : ''}
    ]${isEntityService
    ? `,
    get: [
      authenticate('jwt'),
      resolveAll(${camelName}Resolvers)
    ],
    find: [
      authenticate('jwt'),
      resolveAll(${camelName}Resolvers)
    ],
    create: [
      resolveAll(${camelName}Resolvers)
    ],
    patch: [
      authenticate('jwt'),
      resolveAll(${camelName}Resolvers)
    ],
    update: [
      authenticate('jwt'),
      resolveAll(${camelName}Resolvers)
    ],
    remove: [
      authenticate('jwt'),
      resolveAll(${camelName}Resolvers)
    ]`
    : ''}
  },
  before: {},
  after: {},
  error: {}
}
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib, folder, fileName }) => [
    lib,
    'services',
    ...folder,
    `${fileName}.class`
])));
exports.generate = generate;
//# sourceMappingURL=class.tpl.js.map