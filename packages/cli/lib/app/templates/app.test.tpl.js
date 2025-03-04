"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({ lib }) => `import assert from 'assert'
import axios from 'axios'
import type { Server } from 'http'
import { app } from '../${lib}/app'

const port = app.get('port')
const appUrl = \`http://\${app.get('host')}:\${port}\`

describe('Feathers application tests', () => {
  let server: Server

  before(async () => {
    server = await app.listen(port)
  })

  after(async () => {
    await app.teardown()
  })

  it('starts and shows the index page', async () => {
    const { data } = await axios.get<string>(appUrl)

    assert.ok(data.indexOf('<html lang="en">') !== -1)
  })

  it('shows a 404 JSON error', async () => {
    try {
      await axios.get(\`\${appUrl}/path/to/nowhere\`, {
        responseType: 'json'
      })
      assert.fail('should never get here')
    } catch (error: any) {
      const { response } = error
      assert.strictEqual(response?.status, 404)
      assert.strictEqual(response?.data?.code, 404)
      assert.strictEqual(response?.data?.name, 'NotFound')
    }
  })
})
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)('test', 'app.test')));
exports.generate = generate;
//# sourceMappingURL=app.test.tpl.js.map