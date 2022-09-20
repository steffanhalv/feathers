"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({ camelName, upperName, authStrategies, type }) => `import { schema, querySyntax } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
  
// Schema for the basic data model (e.g. creating new entries)
export const ${camelName}DataSchema = schema({
  $id: '${upperName}Data',
  type: 'object',
  additionalProperties: false,
  required: [ ${authStrategies.includes('local') ? "'email'" : ''} ],
  properties: {
    ${authStrategies
    .map((name) => name === 'local'
    ? `    email: { type: 'string' },
    password: { type: 'string' }`
    : `    ${name}Id: { type: 'string' }`)
    .join(',\n')}
  }
} as const)

export type ${upperName}Data = Infer<typeof ${camelName}DataSchema>


// Schema for making partial updates
export const ${camelName}PatchSchema = schema({
  $id: '${upperName}Patch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...${camelName}DataSchema.properties
  }
} as const)

export type ${upperName}Patch = Infer<typeof ${camelName}PatchSchema>

// Schema for the data that is being returned
export const ${camelName}ResultSchema = schema({
  $id: '${upperName}Result',
  type: 'object',
  additionalProperties: false,
  required: [ '${type === 'mongodb' ? '_id' : 'id'}' ],
  properties: {
    ...${camelName}DataSchema.properties,
    ${type === 'mongodb' ? '_id' : 'id'}: {
      type: '${type === 'mongodb' ? 'string' : 'number'}'
    }
  }
} as const)

export type ${upperName}Result = Infer<typeof ${camelName}ResultSchema>

// Queries shouldn't allow doing anything with the password
const { password, ...${camelName}QueryProperties } = ${camelName}ResultSchema.properties

// Schema for allowed query properties
export const ${camelName}QuerySchema = schema({
  $id: '${upperName}Query',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(${camelName}QueryProperties)
  }
} as const)

export type ${upperName}Query = Infer<typeof ${camelName}QuerySchema>
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib, folder, fileName }) => [
    lib,
    'services',
    ...folder,
    `${fileName}.schema`
]), { force: true }));
exports.generate = generate;
//# sourceMappingURL=user.schema.tpl.js.map