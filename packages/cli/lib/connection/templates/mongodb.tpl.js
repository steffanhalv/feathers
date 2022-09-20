"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({}) => `import { MongoClient } from 'mongodb'
import type { Db } from 'mongodb'
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    mongodbClient: Promise<Db>
  }
}

export const mongodb = (app: Application) => {
  const connection = app.get('mongodb') as string
  const database = connection.substring(connection.lastIndexOf('/') + 1)
  const mongoClient = MongoClient.connect(connection)
    .then(client => client.db(database))

  app.set('mongodbClient', mongoClient)
}
`;
const configurationTemplate = ({ database }) => `   ${database}: { type: 'string' },`;
const importTemplate = "import { mongodb } from './mongodb'";
const configureTemplate = 'app.configure(mongodb)';
const toAppFile = (0, pinion_1.toFile)(({ lib }) => [lib, 'app']);
const generate = (ctx) => (0, pinion_1.generator)(ctx)
    .then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib }) => lib, 'mongodb')))
    .then((0, commons_1.injectSource)(configurationTemplate, (0, pinion_1.before)('authentication: authenticationSettingsSchema'), (0, pinion_1.toFile)(({ lib }) => [lib, 'configuration']), false))
    .then((0, commons_1.injectSource)(importTemplate, (0, pinion_1.before)('import { services } from'), toAppFile))
    .then((0, commons_1.injectSource)(configureTemplate, (0, pinion_1.before)('app.configure(services)'), toAppFile));
exports.generate = generate;
//# sourceMappingURL=mongodb.tpl.js.map