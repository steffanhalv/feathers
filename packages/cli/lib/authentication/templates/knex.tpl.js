"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const migrationTemplate = ({ kebabName, authStrategies }) => `import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('${kebabName}', function (table) {
    table.dropColumn('text')${authStrategies
    .map((name) => name === 'local'
    ? `    
    table.string('email').unique()
    table.string('password')`
    : `    
    table.string('${name}Id')`)
    .join('\n')}
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('${kebabName}', function (table) {
    table.string('text')${authStrategies
    .map((name) => name === 'local'
    ? `    
    table.dropColumn('email')
    table.dropColumn('password')`
    : `    
    table.dropColumn('${name}Id')
    `)
    .join('\n')}
  })
}
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, pinion_1.when)((ctx) => { var _a; return (0, commons_1.getDatabaseAdapter)((_a = ctx.feathers) === null || _a === void 0 ? void 0 : _a.database) === 'knex'; }, (0, commons_1.renderSource)(migrationTemplate, (0, pinion_1.toFile)((0, pinion_1.toFile)('migrations', () => {
    // Probably not great but it works to align with the Knex migration file format
    // We add 2 seconds so that the migrations run in the correct order
    const migrationDate = new Date(Date.now() + 2000)
        .toISOString()
        .replace(/\D/g, '')
        .substring(0, 14);
    return `${migrationDate}_authentication`;
})))));
exports.generate = generate;
//# sourceMappingURL=knex.tpl.js.map