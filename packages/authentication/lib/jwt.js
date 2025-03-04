"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTStrategy = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment */
const omit_1 = __importDefault(require("lodash/omit"));
const errors_1 = require("@feathersjs/errors");
const commons_1 = require("@feathersjs/commons");
// @ts-ignore
const long_timeout_1 = __importDefault(require("long-timeout"));
const strategy_1 = require("./strategy");
const debug = (0, commons_1.createDebug)('@feathersjs/authentication/jwt');
const SPLIT_HEADER = /(\S+)\s+(\S+)/;
class JWTStrategy extends strategy_1.AuthenticationBaseStrategy {
    constructor() {
        super(...arguments);
        this.expirationTimers = new WeakMap();
    }
    get configuration() {
        const authConfig = this.authentication.configuration;
        const config = super.configuration;
        return {
            service: authConfig.service,
            entity: authConfig.entity,
            entityId: authConfig.entityId,
            header: 'Authorization',
            schemes: ['Bearer', 'JWT'],
            ...config
        };
    }
    async handleConnection(event, connection, authResult) {
        const isValidLogout = event === 'logout' &&
            connection.authentication &&
            authResult &&
            connection.authentication.accessToken === authResult.accessToken;
        const { accessToken } = authResult || {};
        if (accessToken && event === 'login') {
            debug('Adding authentication information to connection');
            const { exp } = await this.authentication.verifyAccessToken(accessToken);
            // The time (in ms) until the token expires
            const duration = exp * 1000 - Date.now();
            // This may have to be a `logout` event but right now we don't want
            // the whole context object lingering around until the timer is gone
            const timer = long_timeout_1.default.setTimeout(() => this.app.emit('disconnect', connection), duration);
            debug(`Registering connection expiration timer for ${duration}ms`);
            long_timeout_1.default.clearTimeout(this.expirationTimers.get(connection));
            this.expirationTimers.set(connection, timer);
            debug('Adding authentication information to connection');
            connection.authentication = {
                strategy: this.name,
                accessToken
            };
        }
        else if (event === 'disconnect' || isValidLogout) {
            debug('Removing authentication information and expiration timer from connection');
            const { entity } = this.configuration;
            delete connection[entity];
            delete connection.authentication;
            long_timeout_1.default.clearTimeout(this.expirationTimers.get(connection));
            this.expirationTimers.delete(connection);
        }
    }
    verifyConfiguration() {
        const allowedKeys = ['entity', 'entityId', 'service', 'header', 'schemes'];
        for (const key of Object.keys(this.configuration)) {
            if (!allowedKeys.includes(key)) {
                throw new Error(`Invalid JwtStrategy option 'authentication.${this.name}.${key}'. Did you mean to set it in 'authentication.jwtOptions'?`);
            }
        }
        if (typeof this.configuration.header !== 'string') {
            throw new Error(`The 'header' option for the ${this.name} strategy must be a string`);
        }
    }
    async getEntityQuery(_params) {
        return {};
    }
    /**
     * Return the entity for a given id
     *
     * @param id The id to use
     * @param params Service call parameters
     */
    async getEntity(id, params) {
        const entityService = this.entityService;
        const { entity } = this.configuration;
        debug('Getting entity', id);
        if (entityService === null) {
            throw new errors_1.NotAuthenticated('Could not find entity service');
        }
        const query = await this.getEntityQuery(params);
        const getParams = Object.assign({}, (0, omit_1.default)(params, 'provider'), { query });
        const result = await entityService.get(id, getParams);
        if (!params.provider) {
            return result;
        }
        return entityService.get(id, { ...params, [entity]: result });
    }
    async getEntityId(authResult, _params) {
        return authResult.authentication.payload.sub;
    }
    async authenticate(authentication, params) {
        const { accessToken } = authentication;
        const { entity } = this.configuration;
        if (!accessToken) {
            throw new errors_1.NotAuthenticated('No access token');
        }
        const payload = await this.authentication.verifyAccessToken(accessToken, params.jwt);
        const result = {
            accessToken,
            authentication: {
                strategy: 'jwt',
                accessToken,
                payload
            }
        };
        if (entity === null) {
            return result;
        }
        const entityId = await this.getEntityId(result, params);
        const value = await this.getEntity(entityId, params);
        return {
            ...result,
            [entity]: value
        };
    }
    async parse(req) {
        const { header, schemes } = this.configuration;
        const headerValue = req.headers && req.headers[header.toLowerCase()];
        if (!headerValue || typeof headerValue !== 'string') {
            return null;
        }
        debug('Found parsed header value');
        const [, scheme, schemeValue] = headerValue.match(SPLIT_HEADER) || [];
        const hasScheme = scheme && schemes.some((current) => new RegExp(current, 'i').test(scheme));
        if (scheme && !hasScheme) {
            return null;
        }
        return {
            strategy: this.name,
            accessToken: hasScheme ? schemeValue : headerValue
        };
    }
}
exports.JWTStrategy = JWTStrategy;
//# sourceMappingURL=jwt.js.map