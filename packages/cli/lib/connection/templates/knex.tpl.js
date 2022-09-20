"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({ database }) => `import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    ${database}Client: Knex
  }
}

export const ${database} = (app: Application) => {
  const config = app.get('${database}')
  const db = knex(config!)

  app.set('${database}Client', db)
}
`;
const knexfile = ({ lib, language, database }) => `
import { app } from './${lib}/app'

// Load our database connection info from the app configuration
const config = app.get('${database}')

${language === 'js' ? 'export default config' : 'module.exports = config'}
`;
const configurationTemplate = ({ database }) => `${database}: {
  type: 'object',
  properties: {
    client: { type: 'string' },
    connection: { type: 'string' }
  }
},`;
const importTemplate = ({ database }) => `import { ${database} } from './${database}'`;
const configureTemplate = ({ database }) => `app.configure(${database})`;
const toAppFile = (0, pinion_1.toFile)(({ lib }) => [lib, 'app']);
const toConfig = (0, pinion_1.toFile)(({ lib }) => [lib, 'configuration']);
const generate = (ctx) => (0, pinion_1.generator)(ctx)
    .then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib, database }) => [lib, database])))
    .then((0, commons_1.renderSource)(knexfile, (0, pinion_1.toFile)('knexfile')))
    .then((0, pinion_1.mergeJSON)({
    scripts: {
        migrate: 'knex migrate:latest',
        'migrate:make': 'knex migrate:make',
        test: 'cross-env NODE_ENV=test npm run migrate && npm run mocha'
    }
}, (0, pinion_1.toFile)('package.json')))
    .then((0, commons_1.injectSource)(configurationTemplate, (0, pinion_1.before)('authentication: authenticationSettingsSchema'), toConfig, false))
    .then((0, commons_1.injectSource)(importTemplate, (0, pinion_1.before)('import { services } from'), toAppFile))
    .then((0, commons_1.injectSource)(configureTemplate, (0, pinion_1.before)('app.configure(services)'), toAppFile));
exports.generate = generate;
//# sourceMappingURL=knex.tpl.js.map