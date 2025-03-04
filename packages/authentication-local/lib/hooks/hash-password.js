"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_1 = __importDefault(require("lodash/get"));
const set_1 = __importDefault(require("lodash/set"));
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
const errors_1 = require("@feathersjs/errors");
const commons_1 = require("@feathersjs/commons");
const debug = (0, commons_1.createDebug)('@feathersjs/authentication-local/hooks/hash-password');
/**
 * @deprecated Use Feathers schema resolvers and the `passwordHash` resolver instead
 * @param field
 * @param options
 * @returns
 */
function hashPassword(field, options = {}) {
    if (!field) {
        throw new Error('The hashPassword hook requires a field name option');
    }
    return async (context, next) => {
        const { app, data, params } = context;
        if (data !== undefined) {
            const authService = app.defaultAuthentication(options.authentication);
            const { strategy = 'local' } = options;
            if (!authService || typeof authService.getStrategies !== 'function') {
                throw new errors_1.BadRequest('Could not find an authentication service to hash password');
            }
            const [localStrategy] = authService.getStrategies(strategy);
            if (!localStrategy || typeof localStrategy.hashPassword !== 'function') {
                throw new errors_1.BadRequest(`Could not find '${strategy}' strategy to hash password`);
            }
            const addHashedPassword = async (data) => {
                const password = (0, get_1.default)(data, field);
                if (password === undefined) {
                    debug(`hook.data.${field} is undefined, not hashing password`);
                    return data;
                }
                const hashedPassword = await localStrategy.hashPassword(password, params);
                return (0, set_1.default)((0, cloneDeep_1.default)(data), field, hashedPassword);
            };
            context.data = Array.isArray(data)
                ? await Promise.all(data.map(addHashedPassword))
                : await addHashedPassword(data);
        }
        if (typeof next === 'function') {
            return next();
        }
    };
}
exports.default = hashPassword;
//# sourceMappingURL=hash-password.js.map