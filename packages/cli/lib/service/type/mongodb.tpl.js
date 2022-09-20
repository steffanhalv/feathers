"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.classCode = exports.importTemplate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
exports.importTemplate = `import { MongoDBService } from \'@feathersjs/mongodb\'
import type { MongoDBAdapterParams } from \'@feathersjs/mongodb\'`;
const classCode = ({ className, upperName }) => `export interface ${upperName}Params extends MongoDBAdapterParams<${upperName}Query> {
}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class ${className} extends MongoDBService<${upperName}Result, ${upperName}Data, ${upperName}Params> {
}
`;
exports.classCode = classCode;
const optionTemplate = ({ kebabName }) => `    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('${kebabName}'))`;
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
    .then((0, commons_1.injectSource)(optionTemplate, (0, pinion_1.after)('const options ='), toServiceFile, false));
exports.generate = generate;
//# sourceMappingURL=mongodb.tpl.js.map