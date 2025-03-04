"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStrategy = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const get_1 = __importDefault(require("lodash/get"));
const omit_1 = __importDefault(require("lodash/omit"));
const errors_1 = require("@feathersjs/errors");
const authentication_1 = require("@feathersjs/authentication");
const commons_1 = require("@feathersjs/commons");
const debug = (0, commons_1.createDebug)('@feathersjs/authentication-local/strategy');
class LocalStrategy extends authentication_1.AuthenticationBaseStrategy {
    verifyConfiguration() {
        const config = this.configuration;
        ['usernameField', 'passwordField'].forEach((prop) => {
            if (typeof config[prop] !== 'string') {
                throw new Error(`'${this.name}' authentication strategy requires a '${prop}' setting`);
            }
        });
    }
    get configuration() {
        const authConfig = this.authentication.configuration;
        const config = super.configuration || {};
        return {
            hashSize: 10,
            service: authConfig.service,
            entity: authConfig.entity,
            entityId: authConfig.entityId,
            errorMessage: 'Invalid login',
            entityPasswordField: config.passwordField,
            entityUsernameField: config.usernameField,
            ...config
        };
    }
    async getEntityQuery(query, _params) {
        return {
            $limit: 1,
            ...query
        };
    }
    async findEntity(username, params) {
        const { entityUsernameField, errorMessage } = this.configuration;
        if (!username) {
            // don't query for users without any condition set.
            throw new errors_1.NotAuthenticated(errorMessage);
        }
        const query = await this.getEntityQuery({
            [entityUsernameField]: username
        }, params);
        const findParams = Object.assign({}, params, { query });
        const entityService = this.entityService;
        debug('Finding entity with query', params.query);
        const result = await entityService.find(findParams);
        const list = Array.isArray(result) ? result : result.data;
        if (!Array.isArray(list) || list.length === 0) {
            debug('No entity found');
            throw new errors_1.NotAuthenticated(errorMessage);
        }
        const [entity] = list;
        return entity;
    }
    async getEntity(result, params) {
        const entityService = this.entityService;
        const { entityId = entityService.id, entity } = this.configuration;
        if (!entityId || result[entityId] === undefined) {
            throw new errors_1.NotAuthenticated('Could not get local entity');
        }
        if (!params.provider) {
            return result;
        }
        return entityService.get(result[entityId], {
            ...params,
            [entity]: result
        });
    }
    async comparePassword(entity, password) {
        const { entityPasswordField, errorMessage } = this.configuration;
        // find password in entity, this allows for dot notation
        const hash = (0, get_1.default)(entity, entityPasswordField);
        if (!hash) {
            debug(`Record is missing the '${entityPasswordField}' password field`);
            throw new errors_1.NotAuthenticated(errorMessage);
        }
        debug('Verifying password');
        const result = await bcryptjs_1.default.compare(password, hash);
        if (result) {
            return entity;
        }
        throw new errors_1.NotAuthenticated(errorMessage);
    }
    async hashPassword(password, _params) {
        return bcryptjs_1.default.hash(password, this.configuration.hashSize);
    }
    async authenticate(data, params) {
        const { passwordField, usernameField, entity, errorMessage } = this.configuration;
        const username = data[usernameField];
        const password = data[passwordField];
        if (!password) {
            // exit early if there is no password
            throw new errors_1.NotAuthenticated(errorMessage);
        }
        const result = await this.findEntity(username, (0, omit_1.default)(params, 'provider'));
        await this.comparePassword(result, password);
        return {
            authentication: { strategy: this.name },
            [entity]: await this.getEntity(result, params)
        };
    }
}
exports.LocalStrategy = LocalStrategy;
//# sourceMappingURL=strategy.js.map