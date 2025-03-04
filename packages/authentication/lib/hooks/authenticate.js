"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flatten_1 = __importDefault(require("lodash/flatten"));
const omit_1 = __importDefault(require("lodash/omit"));
const errors_1 = require("@feathersjs/errors");
const commons_1 = require("@feathersjs/commons");
const debug = (0, commons_1.createDebug)('@feathersjs/authentication/hooks/authenticate');
exports.default = (originalSettings, ...originalStrategies) => {
    const settings = typeof originalSettings === 'string'
        ? { strategies: (0, flatten_1.default)([originalSettings, ...originalStrategies]) }
        : originalSettings;
    if (!originalSettings || settings.strategies.length === 0) {
        throw new Error('The authenticate hook needs at least one allowed strategy');
    }
    return async (context, _next) => {
        const next = typeof _next === 'function' ? _next : async () => context;
        const { app, params, type, path, service } = context;
        const { strategies } = settings;
        const { provider, authentication } = params;
        const authService = app.defaultAuthentication(settings.service);
        debug(`Running authenticate hook on '${path}'`);
        if (type && type !== 'before') {
            throw new errors_1.NotAuthenticated('The authenticate hook must be used as a before hook');
        }
        if (!authService || typeof authService.authenticate !== 'function') {
            throw new errors_1.NotAuthenticated('Could not find a valid authentication service');
        }
        if (service === authService) {
            throw new errors_1.NotAuthenticated('The authenticate hook does not need to be used on the authentication service');
        }
        if (params.authenticated === true) {
            return next();
        }
        if (authentication) {
            const authParams = (0, omit_1.default)(params, 'provider', 'authentication');
            debug('Authenticating with', authentication, strategies);
            const authResult = await authService.authenticate(authentication, authParams, ...strategies);
            context.params = Object.assign({}, params, (0, omit_1.default)(authResult, 'accessToken'), {
                authenticated: true
            });
        }
        else if (provider) {
            throw new errors_1.NotAuthenticated('Not authenticated');
        }
        return next();
    };
};
//# sourceMappingURL=authenticate.js.map