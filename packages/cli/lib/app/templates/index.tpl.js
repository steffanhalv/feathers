"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({}) => `import { app } from './app'
import { logger } from './logger'

const port = app.get('port')
const host = app.get('host')

app.listen(port).then(() => {
  logger.info(\`Feathers app listening on http://\${host}:\${port}\`)
})
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ lib }) => lib, 'index')));
exports.generate = generate;
//# sourceMappingURL=index.tpl.js.map