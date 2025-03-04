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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = exports.authenticate = exports.parseAuthentication = exports.notFound = exports.errorHandler = exports.formatter = exports.rest = exports.query = exports.urlencoded = exports.text = exports.raw = exports.json = exports.static = exports.serveStatic = exports.original = void 0;
const express_1 = __importDefault(require("express"));
const feathers_1 = require("@feathersjs/feathers");
const transport_commons_1 = require("@feathersjs/transport-commons");
const commons_1 = require("@feathersjs/commons");
const cors_1 = __importDefault(require("cors"));
exports.cors = cors_1.default;
const rest_1 = require("./rest");
Object.defineProperty(exports, "rest", { enumerable: true, get: function () { return rest_1.rest; } });
Object.defineProperty(exports, "formatter", { enumerable: true, get: function () { return rest_1.formatter; } });
const handlers_1 = require("./handlers");
Object.defineProperty(exports, "errorHandler", { enumerable: true, get: function () { return handlers_1.errorHandler; } });
Object.defineProperty(exports, "notFound", { enumerable: true, get: function () { return handlers_1.notFound; } });
const authentication_1 = require("./authentication");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return authentication_1.authenticate; } });
Object.defineProperty(exports, "parseAuthentication", { enumerable: true, get: function () { return authentication_1.parseAuthentication; } });
const express_2 = __importStar(require("express"));
Object.defineProperty(exports, "original", { enumerable: true, get: function () { return express_2.default; } });
Object.defineProperty(exports, "serveStatic", { enumerable: true, get: function () { return express_2.static; } });
Object.defineProperty(exports, "static", { enumerable: true, get: function () { return express_2.static; } });
Object.defineProperty(exports, "json", { enumerable: true, get: function () { return express_2.json; } });
Object.defineProperty(exports, "raw", { enumerable: true, get: function () { return express_2.raw; } });
Object.defineProperty(exports, "text", { enumerable: true, get: function () { return express_2.text; } });
Object.defineProperty(exports, "urlencoded", { enumerable: true, get: function () { return express_2.urlencoded; } });
Object.defineProperty(exports, "query", { enumerable: true, get: function () { return express_2.query; } });
const debug = (0, commons_1.createDebug)('@feathersjs/express');
function feathersExpress(feathersApp, expressApp = (0, express_1.default)()) {
    if (!feathersApp) {
        return expressApp;
    }
    if (typeof feathersApp.setup !== 'function') {
        throw new Error('@feathersjs/express requires a valid Feathers application instance');
    }
    const app = expressApp;
    const { use: expressUse, listen: expressListen } = expressApp;
    const { use: feathersUse, teardown: feathersTeardown } = feathersApp;
    Object.assign(app, {
        use(location, ...rest) {
            let service;
            let options = {};
            const middleware = rest.reduce(function (middleware, arg) {
                if (typeof arg === 'function' || Array.isArray(arg)) {
                    middleware[service ? 'after' : 'before'].push(arg);
                }
                else if (!service) {
                    service = arg;
                }
                else if (arg.methods || arg.events || arg.express || arg.koa) {
                    options = arg;
                }
                else {
                    throw new Error('Invalid options passed to app.use');
                }
                return middleware;
            }, {
                before: [],
                after: []
            });
            const hasMethod = (methods) => methods.some((name) => service && typeof service[name] === 'function');
            // Check for service (any object with at least one service method)
            if (hasMethod(['handle', 'set']) || !hasMethod(feathers_1.defaultServiceMethods)) {
                debug('Passing app.use call to Express app');
                return expressUse.call(this, location, ...rest);
            }
            debug('Registering service with middleware', middleware);
            // Since this is a service, call Feathers `.use`
            feathersUse.call(this, location, service, {
                express: middleware,
                ...options
            });
            return this;
        },
        async listen(...args) {
            const server = expressListen.call(this, ...args);
            this.server = server;
            await this.setup(server);
            debug('Feathers application listening');
            return server;
        },
        async teardown(server) {
            return feathersTeardown.call(this, server).then(() => new Promise((resolve, reject) => {
                if (this.server) {
                    this.server.close((e) => (e ? reject(e) : resolve(this)));
                }
                else {
                    resolve(this);
                }
            }));
        }
    });
    const appDescriptors = {
        ...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(app)),
        ...Object.getOwnPropertyDescriptors(app)
    };
    const newDescriptors = {
        ...Object.getOwnPropertyDescriptors(Object.getPrototypeOf(feathersApp)),
        ...Object.getOwnPropertyDescriptors(feathersApp)
    };
    // Copy all non-existing properties (including non-enumerables)
    // that don't already exist on the Express app
    Object.keys(newDescriptors).forEach((prop) => {
        const appProp = appDescriptors[prop];
        const newProp = newDescriptors[prop];
        if (appProp === undefined && newProp !== undefined) {
            Object.defineProperty(expressApp, prop, newProp);
        }
    });
    app.configure((0, transport_commons_1.routing)());
    return app;
}
exports.default = feathersExpress;
if (typeof module !== 'undefined') {
    module.exports = Object.assign(feathersExpress, module.exports);
}
//# sourceMappingURL=index.js.map