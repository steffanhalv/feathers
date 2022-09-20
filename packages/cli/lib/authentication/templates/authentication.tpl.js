"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({ authStrategies }) => `import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { OAuthStrategy } from '@feathersjs/authentication-oauth'
import { oauth } from '@feathersjs/authentication-oauth'
import type { Application } from './declarations'

declare module './declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  ${authStrategies
    .map((strategy) => `  authentication.register('${strategy}', ${strategy === 'local' ? `new LocalStrategy()` : `new OAuthStrategy()`})`)
    .join('\n')}

  app.use('authentication', authentication)
  app.configure(oauth())
}
`;
const importTemplate = "import { authentication } from './authentication'";
const configureTemplate = 'app.configure(authentication)';
const toAppFile = (0, pinion_1.toFile)(({ lib }) => [lib, 'app']);
const generate = (ctx) => (0, pinion_1.generator)(ctx)
    .then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib }) => lib, 'authentication')))
    .then((0, commons_1.injectSource)(importTemplate, (0, pinion_1.before)('import { services } from'), toAppFile))
    .then((0, commons_1.injectSource)(configureTemplate, (0, pinion_1.before)('app.configure(services)'), toAppFile));
exports.generate = generate;
//# sourceMappingURL=authentication.tpl.js.map