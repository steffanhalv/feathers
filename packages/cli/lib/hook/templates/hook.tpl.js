"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const aroundTemplate = ({ camelName, name }) => `
import type { HookContext, NextFunction } from '../declarations'

export const ${camelName} = async (context: HookContext, next: NextFunction) => {
  console.log(\`Running hook ${name} on \${context.path}\.\${context.method}\`)
  await next()
}
`;
const regularTemplate = ({ camelName, name }) => `import type { HookContext } from '../declarations'

export const ${camelName} = async (context: HookContext) => {
  console.log(\`Running hook ${name} on \${context.path}\.\${context.method}\`)
}`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)((ctx) => (ctx.type === 'around' ? aroundTemplate(ctx) : regularTemplate(ctx)), (0, pinion_1.toFile)(({ lib, kebabName }) => [lib, 'hooks', kebabName])));
exports.generate = generate;
//# sourceMappingURL=hook.tpl.js.map