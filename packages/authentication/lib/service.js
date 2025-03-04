"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const merge_1 = __importDefault(require("lodash/merge"));
const errors_1 = require("@feathersjs/errors");
const core_1 = require("./core");
const hooks_1 = require("./hooks");
require("@feathersjs/transport-commons");
const commons_1 = require("@feathersjs/commons");
const schema_1 = require("@feathersjs/schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const debug = (0, commons_1.createDebug)('@feathersjs/authentication/service');
class AuthenticationService extends core_1.AuthenticationBase {
    constructor(app, configKey = 'authentication', options = {}) {
        super(app, configKey, options);
        if (typeof app.defaultAuthentication !== 'function') {
            app.defaultAuthentication = function (location) {
                const configKey = app.get('defaultAuthentication');
                const path = location ||
                    Object.keys(this.services).find((current) => this.service(current).configKey === configKey);
                return path ? this.service(path) : null;
            };
        }
    }
    /**
     * Return the payload for a JWT based on the authentication result.
     * Called internally by the `create` method.
     *
     * @param _authResult The current authentication result
     * @param params The service call parameters
     */
    async getPayload(_authResult, params) {
        // Uses `params.payload` or returns an empty payload
        const { payload = {} } = params;
        return payload;
    }
    /**
     * Returns the JWT options based on an authentication result.
     * By default sets the JWT subject to the entity id.
     *
     * @param authResult The authentication result
     * @param params Service call parameters
     */
    async getTokenOptions(authResult, params) {
        const { service, entity, entityId } = this.configuration;
        const jwtOptions = (0, merge_1.default)({}, params.jwtOptions, params.jwt);
        const value = service && entity && authResult[entity];
        // Set the subject to the entity id if it is available
        if (value && !jwtOptions.subject) {
            const idProperty = entityId || this.app.service(service).id;
            const subject = value[idProperty];
            if (subject === undefined) {
                throw new errors_1.NotAuthenticated(`Can not set subject from ${entity}.${idProperty}`);
            }
            jwtOptions.subject = `${subject}`;
        }
        return jwtOptions;
    }
    /**
     * Create and return a new JWT for a given authentication request.
     * Will trigger the `login` event.
     *
     * @param data The authentication request (should include `strategy` key)
     * @param params Service call parameters
     */
    async create(data, params) {
        const authStrategies = params.authStrategies || this.configuration.authStrategies;
        if (!authStrategies.length) {
            throw new errors_1.NotAuthenticated('No authentication strategies allowed for creating a JWT (`authStrategies`)');
        }
        const authResult = await this.authenticate(data, params, ...authStrategies);
        debug('Got authentication result', authResult);
        if (authResult.accessToken) {
            return authResult;
        }
        const [payload, jwtOptions] = await Promise.all([
            this.getPayload(authResult, params),
            this.getTokenOptions(authResult, params)
        ]);
        debug('Creating JWT with', payload, jwtOptions);
        const accessToken = await this.createAccessToken(payload, jwtOptions, params.secret);
        return {
            accessToken,
            ...authResult,
            authentication: {
                ...authResult.authentication,
                payload: jsonwebtoken_1.default.decode(accessToken)
            }
        };
    }
    /**
     * Mark a JWT as removed. By default only verifies the JWT and returns the result.
     * Triggers the `logout` event.
     *
     * @param id The JWT to remove or null
     * @param params Service call parameters
     */
    async remove(id, params) {
        const { authentication } = params;
        const { authStrategies } = this.configuration;
        // When an id is passed it is expected to be the authentication `accessToken`
        if (id !== null && id !== authentication.accessToken) {
            throw new errors_1.NotAuthenticated('Invalid access token');
        }
        debug('Verifying authentication strategy in remove');
        return this.authenticate(authentication, params, ...authStrategies);
    }
    /**
     * Validates the service configuration.
     */
    async setup() {
        await super.setup();
        // The setup method checks for valid settings and registers the
        // connection and event (login, logout) hooks
        const { secret, service, entity, entityId } = this.configuration;
        if (typeof secret !== 'string') {
            throw new Error("A 'secret' must be provided in your authentication configuration");
        }
        if (entity !== null) {
            if (service === undefined) {
                throw new Error("The 'service' option is not set in the authentication configuration");
            }
            if (this.app.service(service) === undefined) {
                throw new Error(`The '${service}' entity service does not exist (set to 'null' if it is not required)`);
            }
            if (this.app.service(service).id === undefined && entityId === undefined) {
                throw new Error(`The '${service}' service does not have an 'id' property and no 'entityId' option is set.`);
            }
        }
        this.hooks({
            create: [(0, schema_1.resolveDispatch)(), (0, hooks_1.connection)('login'), (0, hooks_1.event)('login')],
            remove: [(0, schema_1.resolveDispatch)(), (0, hooks_1.connection)('logout'), (0, hooks_1.event)('logout')]
        });
        this.app.on('disconnect', async (connection) => {
            await this.handleConnection('disconnect', connection);
        });
        if (typeof this.publish === 'function') {
            this.publish(() => null);
        }
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=service.js.map