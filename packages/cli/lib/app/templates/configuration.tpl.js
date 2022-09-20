"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({}) => `import { schema, Ajv } from '@feathersjs/schema'
import type { Infer } from '@feathersjs/schema'
import { authenticationSettingsSchema } from '@feathersjs/authentication'

export const configurationSchema = schema(
  {
    $id: 'ApplicationConfiguration',
    type: 'object',
    additionalProperties: false,
    required: [ 'host', 'port', 'public', 'paginate' ],
    properties: {
      host: { type: 'string' },
      port: { type: 'number' },
      public: { type: 'string' },
      authentication: authenticationSettingsSchema,
      origins: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      paginate: {
        type: 'object',
        additionalProperties: false,
        required: [ 'default', 'max' ],
        properties: {
          default: { type: 'number' },
          max: { type: 'number' }
        }
      }
    }
  } as const,
  new Ajv()
)

export type ConfigurationSchema = Infer<typeof configurationSchema>
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib }) => lib, 'configuration')));
exports.generate = generate;
//# sourceMappingURL=configuration.tpl.js.map