"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.importTemplate = exports.template = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({ className, upperName, relative }) => `import type { Application } from '${relative}/declarations'
  
export interface ${className}Options {
  app: Application
}

export interface ${upperName}Params extends Params<${upperName}Query> {

}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class ${className} {
  constructor (public options: ${className}Options) {
  }

  async find (_params?: ${upperName}Params): Promise<${upperName}Result[]> {
    return []
  }

  async get (id: Id, _params?: ${upperName}Params): Promise<${upperName}Result> {
    return {
      id: 0,
      text: \`A new message with ID: \${id}!\`
    }
  }

  async create (data: ${upperName}Data, params?: ${upperName}Params): Promise<${upperName}Result>
  async create (data: ${upperName}Data[], params?: ${upperName}Params): Promise<${upperName}Result[]>
  async create (data: ${upperName}Data|${upperName}Data[], params?: ${upperName}Params): Promise<${upperName}Result|${upperName}Result[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return {
      id: 0,
      ...data
    }
  }

  async update (id: NullableId, data: ${upperName}Data, _params?: ${upperName}Params): Promise<${upperName}Result> {
    return {
      id: 0,
      ...data
    }
  }

  async patch (id: NullableId, data: ${upperName}Data, _params?: ${upperName}Params): Promise<${upperName}Result> {
    return {
      id: 0,
      ...data
    }
  }

  async remove (id: NullableId, _params?: ${upperName}Params): Promise<${upperName}Result> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}
`;
exports.template = template;
exports.importTemplate = "import type { Id, NullableId, Params } from '@feathersjs/feathers'";
const optionTemplate = ({}) => `    app`;
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
    .then((0, commons_1.injectSource)(exports.template, (0, pinion_1.append)(), toClassFile))
    .then((0, commons_1.injectSource)(exports.importTemplate, (0, pinion_1.prepend)(), toClassFile))
    .then((0, commons_1.injectSource)(optionTemplate, (0, pinion_1.after)('const options ='), toServiceFile, false));
exports.generate = generate;
//# sourceMappingURL=custom.tpl.js.map