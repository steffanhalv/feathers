"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({}) => `import type { Application } from '../declarations'

export const services = (app: Application) => {
  // All services will be registered here
}
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib }) => lib, 'services', 'index')));
exports.generate = generate;
//# sourceMappingURL=services.tpl.js.map