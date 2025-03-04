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
Object.defineProperty(exports, "__esModule", { value: true });
exports.routing = void 0;
const router_1 = require("./router");
__exportStar(require("./router"), exports);
const lookup = function (path) {
    const result = this.routes.lookup(path);
    if (result === null) {
        return null;
    }
    const { params: colonParams, data: { service, params: dataParams } } = result;
    const params = dataParams ? { ...dataParams, ...colonParams } : colonParams;
    return { service, params };
};
const routing = () => (app) => {
    if (typeof app.lookup === 'function') {
        return;
    }
    app.routes = new router_1.Router();
    app.lookup = lookup;
    // This mixin allows us to unregister a service. It needs to run
    // first so that `teardown` hooks still get registered properly
    app.mixins.unshift((service) => {
        const { teardown } = service;
        service.teardown = async function (app, path) {
            if (typeof teardown === 'function') {
                await teardown.call(this, app, path);
            }
            app.routes.remove(path);
            app.routes.remove(`${path}/:__id`);
        };
    });
    // Add a mixin that registers a service on the router
    app.mixins.push((service, path, options) => {
        const { routeParams: params = {} } = options;
        app.routes.insert(path, { service, params });
        app.routes.insert(`${path}/:__id`, { service, params });
    });
};
exports.routing = routing;
//# sourceMappingURL=index.js.map