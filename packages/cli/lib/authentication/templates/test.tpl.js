"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const pinion_1 = require("@feathershq/pinion");
const commons_1 = require("../../commons");
const template = ({ authStrategies, lib }) => `import assert from 'assert';
import { app } from '../${lib}/app';

describe('authentication', () => {
  ${authStrategies.includes('local')
    ? `
  const userInfo = {
    email: 'someone@example.com',
    password: 'supersecret'
  }

  before(async () => {
    try {
      await app.service('users').create(userInfo)
    } catch (error) {
      // Do nothing, it just means the user already exists and can be tested
    }
  });

  it('authenticates user and creates accessToken', async () => {
    const { user, accessToken } = await app.service('authentication').create({
      strategy: 'local',
      ...userInfo
    }, {})
    
    assert.ok(accessToken, 'Created access token for user')
    assert.ok(user, 'Includes user in authentication data')
  })`
    : ''}

  it('registered the authentication service', () => {
    assert.ok(app.service('authentication'))
  })
})
`;
const generate = (ctx) => (0, pinion_1.generator)(ctx).then((0, commons_1.renderSource)(template, (0, pinion_1.toFile)(({ test }) => test, 'authentication.test')));
exports.generate = generate;
//# sourceMappingURL=test.tpl.js.map