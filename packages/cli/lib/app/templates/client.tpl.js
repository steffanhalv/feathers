"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({}) => `import { feathers } from '@feathersjs/feathers'
import type { Paginated, ClientService, TransportConnection, Params } from '@feathersjs/feathers'

export interface ServiceTypes {
  // A mapping of client side services
}

export const createClient = <Configuration = any> (connection: TransportConnection<ServiceTypes>) => {
  const client = feathers<ServiceTypes, Configuration>()

  client.configure(connection)

  return client
}
`;
const generate = async (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib }) => lib, 'client')));
exports.generate = generate;
//# sourceMappingURL=client.tpl.js.map