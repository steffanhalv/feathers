"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.koa = exports.cors = exports.bodyParser = exports.Koa = void 0;
const koa_1 = __importDefault(require("koa"));
exports.Koa = koa_1.default;
const koa_qs_1 = __importDefault(require("koa-qs"));
const transport_commons_1 = require("@feathersjs/transport-commons");
const commons_1 = require("@feathersjs/commons");
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
exports.bodyParser = koa_bodyparser_1.default;
const cors_1 = __importDefault(require("@koa/cors"));
exports.cors = cors_1.default;
__exportStar(require("./authentication"), exports);
__exportStar(require("./declarations"), exports);
__exportStar(require("./handlers"), exports);
__exportStar(require("./rest"), exports);
const debug = (0, commons_1.createDebug)('@feathersjs/koa');
function koa(feathersApp, koaApp = new koa_1.default()) {
    if (!feathersApp) {
        return koaApp;
    }
    if (typeof feathersApp.setup !== 'function') {
        throw new Error('@feathersjs/koa requires a valid Feathers application instance');
    }
    const app = feathersApp;
    const { listen: koaListen, use: koaUse } = koaApp;
    const { use: feathersUse, teardown: feathersTeardown } = feathersApp;
    Object.assign(app, {
        use(location, ...args) {
            if (typeof location === 'string') {
                return feathersUse.call(this, location, ...args);
            }
            return koaUse.call(this, location);
        },
        async listen(port, ...args) {
            const server = koaListen.call(this, port, ...args);
            this.server = server;
            await this.setup(server);
            debug('Feathers application listening');
            return server;
        },
        async teardown(server) {
            return feathersTeardown
                .call(this, server)
                .then(() => new Promise((resolve, reject) => this.server.close((e) => (e ? reject(e) : resolve(this)))));
        }
    });
    const appDescriptors = {
        ...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(app)),
        ...Object.getOwnPropertyDescriptors(app)
    };
    const newDescriptors = {
        ...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(koaApp)),
        ...Object.getOwnPropertyDescriptors(koaApp)
    };
    // Copy all non-existing properties (including non-enumerables)
    // that don't already exist on the Express app
    Object.keys(newDescriptors).forEach((prop) => {
        const appProp = appDescriptors[prop];
        const newProp = newDescriptors[prop];
        if (appProp === undefined && newProp !== undefined) {
            Object.defineProperty(app, prop, newProp);
        }
    });
    (0, koa_qs_1.default)(app);
    app.configure((0, transport_commons_1.routing)());
    app.use((ctx, next) => {
        ctx.feathers = { ...ctx.feathers, provider: 'rest' };
        return next();
    });
    return app;
}
exports.koa = koa;
//# sourceMappingURL=index.js.map