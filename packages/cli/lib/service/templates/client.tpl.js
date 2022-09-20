"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const schemaImports = ({ upperName, folder, fileName }) => `import type {
  ${upperName}Data,
  ${upperName}Patch,
  ${upperName}Result,
  ${upperName}Query,
} from './services/${folder.join('/')}/${fileName}.schema'

export type {
  ${upperName}Data,
  ${upperName}Patch,
  ${upperName}Result,
  ${upperName}Query,
}`;
const declarationTemplate = ({ path, upperName }) => `  '${path}': ClientService<
    ${upperName}Result,
    ${upperName}Data,
    ${upperName}Patch,
    Paginated<${upperName}Result>, 
    Params<${upperName}Query>
  >`;
const toClientFile = (0, pinion_1.toFile)(({ lib }) => [lib, 'client.ts']);
const generate = async (ctx) => (0, pinion_1.generator)(ctx).then((0, pinion_1.when)((ctx) => ctx.language === 'ts', (0, pinion_1.inject)(schemaImports, (0, pinion_1.after)("from '@feathersjs/feathers'"), toClientFile), (0, pinion_1.inject)(declarationTemplate, (0, pinion_1.after)('export interface ServiceTypes'), toClientFile)));
exports.generate = generate;
//# sourceMappingURL=client.tpl.js.map