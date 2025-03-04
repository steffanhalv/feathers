"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const crypto_1 = __importDefault(require("crypto"));
const pinion_1 = require("@feathershq/pinion");
const generate = (ctx) => (0, pinion_1.generator)(ctx)
    .then((0, pinion_1.mergeJSON)(({ authStrategies }) => {
    const authentication = {
        entity: ctx.entity,
        service: ctx.service,
        secret: crypto_1.default.randomBytes(24).toString('base64'),
        authStrategies: ['jwt'],
        jwtOptions: {
            header: {
                typ: 'access'
            },
            audience: 'https://yourdomain.com',
            algorithm: 'HS256',
            expiresIn: '1d'
        }
    };
    if (authStrategies.includes('local')) {
        authentication.authStrategies.push('local');
        authentication.local = {
            usernameField: 'email',
            passwordField: 'password'
        };
    }
    const oauthStrategies = authStrategies.filter((name) => name !== 'local');
    if (oauthStrategies.length) {
        authentication.oauth = oauthStrategies.reduce((oauth, name) => {
            oauth[name] = {
                key: '<Client ID>',
                secret: '<Client secret>'
            };
            return oauth;
        }, {});
    }
    return { authentication };
}, (0, pinion_1.toFile)('config', 'default.json')))
    .then((0, pinion_1.mergeJSON)({
    authentication: {
        secret: 'FEATHERS_SECRET'
    }
}, (0, pinion_1.toFile)('config', 'custom-environment-variables.json')));
exports.generate = generate;
//# sourceMappingURL=config.tpl.js.map