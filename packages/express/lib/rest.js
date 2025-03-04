"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rest = exports.formatter = void 0;
const express_1 = require("express");
const errors_1 = require("@feathersjs/errors");
const commons_1 = require("@feathersjs/commons");
const transport_commons_1 = require("@feathersjs/transport-commons");
const feathers_1 = require("@feathersjs/feathers");
const authentication_1 = require("./authentication");
const debug = (0, commons_1.createDebug)('@feathersjs/express/rest');
const toHandler = (func) => {
    return (req, res, next) => func(req, res, next).catch((error) => next(error));
};
const serviceMiddleware = () => {
    return toHandler(async (req, res, next) => {
        const { query, headers, path, body: data, method: httpMethod } = req;
        const methodOverride = req.headers[transport_commons_1.http.METHOD_HEADER];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { service, params: { __id: id = null, ...route } = {} } = req.lookup;
        const method = transport_commons_1.http.getServiceMethod(httpMethod, id, methodOverride);
        const { methods } = (0, feathers_1.getServiceOptions)(service);
        debug(`Found service for path ${path}, attempting to run '${method}' service method`);
        if (!methods.includes(method) || feathers_1.defaultServiceMethods.includes(methodOverride)) {
            const error = new errors_1.MethodNotAllowed(`Method \`${method}\` is not supported by this endpoint.`);
            res.statusCode = error.code;
            throw error;
        }
        const createArguments = transport_commons_1.http.argumentsFor[method] || transport_commons_1.http.argumentsFor.default;
        const params = { query, headers, route, ...req.feathers };
        const args = createArguments({ id, data, params });
        const contextBase = (0, feathers_1.createContext)(service, method, { http: {} });
        res.hook = contextBase;
        const context = await service[method](...args, contextBase);
        res.hook = context;
        const response = transport_commons_1.http.getResponse(context);
        res.statusCode = response.status;
        res.set(response.headers);
        res.data = response.body;
        return next();
    });
};
const servicesMiddleware = () => {
    return toHandler(async (req, res, next) => {
        const app = req.app;
        const lookup = app.lookup(req.path);
        if (!lookup) {
            return next();
        }
        req.lookup = lookup;
        const options = (0, feathers_1.getServiceOptions)(lookup.service);
        const middleware = options.express.composed;
        return middleware(req, res, next);
    });
};
const formatter = (_req, res, next) => {
    if (res.data === undefined) {
        return next();
    }
    res.format({
        'application/json'() {
            res.json(res.data);
        }
    });
};
exports.formatter = formatter;
const rest = (options) => {
    options = typeof options === 'function' ? { formatter: options } : options || {};
    const formatterMiddleware = options.formatter || exports.formatter;
    const authenticationOptions = options.authentication;
    return (app) => {
        if (typeof app.route !== 'function') {
            throw new Error('@feathersjs/express/rest needs an Express compatible app.');
        }
        app.use((req, _res, next) => {
            req.feathers = { ...req.feathers, provider: 'rest' };
            return next();
        });
        app.use((0, authentication_1.parseAuthentication)(authenticationOptions));
        app.use(servicesMiddleware());
        app.mixins.push((_service, _path, options) => {
            const { express: { before = [], after = [] } = {} } = options;
            const middlewares = [].concat(before, serviceMiddleware(), after, formatterMiddleware);
            const middleware = (0, express_1.Router)().use(middlewares);
            options.express || (options.express = {});
            options.express.composed = middleware;
        });
    };
};
exports.rest = rest;
//# sourceMappingURL=rest.js.map