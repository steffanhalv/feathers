"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({ relative, path, className, camelName, fileName }) => `import type { Application } from '${relative}/declarations'

import { ${className}, ${camelName}Hooks } from './${fileName}.class'

// A configure function that registers the service and its hooks via \`app.configure\`
export function ${camelName} (app: Application) {
  const options = { // Service options will go here
  }

  // Register our service on the Feathers application
  app.use('${path}', new ${className}(options), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('${path}').hooks(${camelName}Hooks)
}

// Add this service to the service type index
declare module '${relative}/declarations' {
  interface ServiceTypes {
    '${path}': ${className}
  }
}
`;
const importTemplate = ({ camelName, folder, fileName }) => `import { ${camelName} } from './${folder.join('/')}/${fileName}.service'`;
const configureTemplate = ({ camelName }) => `  app.configure(${camelName})`;
const toServiceIndex = (0, pinion_1.toFile)(({ lib }) => [lib, 'services', `index`]);
const generate = (ctx) => (0, pinion_1.generator)(ctx)
    .then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib, folder, fileName }) => [
    lib,
    'services',
    ...folder,
    `${fileName}.service`
])))
    .then((0, commons_1.injectSource)(importTemplate, (0, pinion_1.prepend)(), toServiceIndex))
    .then((0, commons_1.injectSource)(configureTemplate, (0, pinion_1.after)('export const services'), toServiceIndex));
exports.generate = generate;
//# sourceMappingURL=service.tpl.js.map