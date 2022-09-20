"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({ camelName, upperName, relative, fileName }) => `import { resolve } from '@feathersjs/schema'
import type { HookContext } from '${relative}/declarations'

import type {
  ${upperName}Data,
  ${upperName}Patch,
  ${upperName}Result,
  ${upperName}Query,
} from './${fileName}.schema'
import {
  ${camelName}DataSchema,
  ${camelName}PatchSchema,
  ${camelName}ResultSchema,
  ${camelName}QuerySchema
} from './${fileName}.schema'


// Resolver for the basic data model (e.g. creating new entries)
export const ${camelName}DataResolver = resolve<${upperName}Data, HookContext>({
  schema: ${camelName}DataSchema,
  validate: 'before',
  properties: {}
})


// Resolver for making partial updates
export const ${camelName}PatchResolver = resolve<${upperName}Patch, HookContext>({
  schema: ${camelName}PatchSchema,
  validate: 'before',
  properties: {}
})


// Resolver for the data that is being returned
export const ${camelName}ResultResolver = resolve<${upperName}Result, HookContext>({
  schema: ${camelName}ResultSchema,
  validate: false,
  properties: {}
})


// Resolver for query properties
export const ${camelName}QueryResolver = resolve<${upperName}Query, HookContext>({
  schema: ${camelName}QuerySchema,
  validate: 'before',
  properties: {}
})


// Export all resolvers in a format that can be used with the resolveAll hook
export const ${camelName}Resolvers = {
  result: ${camelName}ResultResolver,
  data: {
    create: ${camelName}DataResolver,
    update: ${camelName}DataResolver,
    patch: ${camelName}PatchResolver
  },
  query: ${camelName}QueryResolver
}
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib, folder, fileName }) => [
    lib,
    'services',
    ...folder,
    `${fileName}.resolver`
])));
exports.generate = generate;
//# sourceMappingURL=resolver.tpl.js.map