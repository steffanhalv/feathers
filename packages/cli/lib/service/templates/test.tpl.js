"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({ relative, lib, path }) => `import assert from 'assert'
import { app } from '../${relative}/${lib}/app'

describe('${path} service', () => {
  it('registered the service', () => {
    const service = app.service('${path}')

    assert.ok(service, 'Registered the service')
  })
})
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ test, folder, fileName }) => [
    test,
    'services',
    ...folder,
    `${fileName}.test`
])));
exports.generate = generate;
//# sourceMappingURL=test.tpl.js.map