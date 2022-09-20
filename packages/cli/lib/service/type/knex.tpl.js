"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.optionTemplate = exports.classCode = exports.importTemplate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const migrationTemplate = ({ kebabName }) => `import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('${kebabName}', table => {
    table.increments('id')
    table.string('text')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('${kebabName}')
}
`;
exports.importTemplate = `import { KnexService } from \'@feathersjs/knex\'
import type { KnexAdapterParams } from \'@feathersjs/knex\'`;
const classCode = ({ className, upperName }) => `export interface ${upperName}Params extends KnexAdapterParams<${upperName}Query> {
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ${className} extends KnexService<${upperName}Result, ${upperName}Data, ${upperName}Params> {
}
`;
exports.classCode = classCode;
const optionTemplate = ({ kebabName, feathers }) => `    paginate: app.get('paginate'),
    Model: app.get('${feathers.database}Client'),
    name: '${kebabName}'`;
exports.optionTemplate = optionTemplate;
const toServiceFile = (0, pinion_1.toFile)(({ lib, folder, fileName }) => [
    lib,
    'services',
    ...folder,
    `${fileName}.service`
]);
const toClassFile = (0, pinion_1.toFile)(({ lib, folder, fileName }) => [
    lib,
    'services',
    ...folder,
    `${fileName}.class`
]);
const generate = (ctx) => (0, pinion_1.generator)(ctx)
    .then((0, commons_1.injectSource)(exports.classCode, (0, pinion_1.append)(), toClassFile))
    .then((0, commons_1.injectSource)(exports.importTemplate, (0, pinion_1.prepend)(), toClassFile))
    .then((0, commons_1.injectSource)(exports.optionTemplate, (0, pinion_1.after)('const options ='), toServiceFile, false))
    .then((0, commons_1.renderSource)(migrationTemplate, (0, pinion_1.toFile)('migrations', ({ kebabName }) => {
    // Probably not great but it works to align with the Knex migration file format
    const migrationDate = new Date().toISOString().replace(/\D/g, '').substring(0, 14);
    return `${migrationDate}_${kebabName}`;
})));
exports.generate = generate;
//# sourceMappingURL=knex.tpl.js.map