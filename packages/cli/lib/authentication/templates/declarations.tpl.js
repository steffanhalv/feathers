"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const importTemplate = ({ upperName, folder, fileName }) => `import { ${upperName}Result } from './services/${folder.join('/')}/${fileName}.schema'
`;
const paramsTemplate = ({ entity, upperName }) => `// Add the ${entity} as an optional property to all params
declare module '@feathersjs/feathers' {
  interface Params {
    ${entity}?: ${upperName}Result
  }
}
`;
const toDeclarationFile = (0, pinion_1.toFile)(({ lib }) => lib, 'declarations.ts');
const generate = (ctx) => (0, pinion_1.generator)(ctx)
    .then((0, pinion_1.when)((ctx) => ctx.language === 'ts', (0, pinion_1.inject)(importTemplate, (0, pinion_1.before)('export { NextFunction }'), toDeclarationFile)))
    .then((0, pinion_1.when)((ctx) => ctx.language === 'ts', (0, pinion_1.inject)(paramsTemplate, (0, pinion_1.append)(), toDeclarationFile)));
exports.generate = generate;
//# sourceMappingURL=declarations.tpl.js.map