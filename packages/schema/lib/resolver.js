"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = exports.Resolver = void 0;
const errors_1 = require("@feathersjs/errors");
class Resolver {
    constructor(options) {
        this.options = options;
    }
    async resolveProperty(name, data, context, status = {}) {
        const resolver = this.options.properties[name];
        const value = data[name];
        const { path = [], stack = [] } = status || {};
        // This prevents circular dependencies
        if (stack.includes(resolver)) {
            return undefined;
        }
        const resolverStatus = {
            ...status,
            path: [...path, name],
            stack: [...stack, resolver]
        };
        return resolver(value, data, context, resolverStatus);
    }
    async convert(data, context, status) {
        if (this.options.converter) {
            const { path = [], stack = [] } = status || {};
            return this.options.converter(data, context, { ...status, path, stack });
        }
        return data;
    }
    async resolve(_data, context, status) {
        const { properties: resolvers, schema, validate } = this.options;
        const payload = await this.convert(_data, context, status);
        const data = schema && validate === 'before' ? await schema.validate(payload) : payload;
        const propertyList = (Array.isArray(status === null || status === void 0 ? void 0 : status.properties)
            ? status === null || status === void 0 ? void 0 : status.properties
            : // By default get all data and resolver keys but remove duplicates
                [...new Set(Object.keys(data).concat(Object.keys(resolvers)))]);
        const result = {};
        const errors = {};
        let hasErrors = false;
        // Not the most elegant but better performance
        await Promise.all(propertyList.map(async (name) => {
            const value = data[name];
            if (resolvers[name]) {
                try {
                    const resolved = await this.resolveProperty(name, data, context, status);
                    if (resolved !== undefined) {
                        result[name] = resolved;
                    }
                }
                catch (error) {
                    // TODO add error stacks
                    const convertedError = typeof error.toJSON === 'function' ? error.toJSON() : { message: error.message || error };
                    errors[name] = convertedError;
                    hasErrors = true;
                }
            }
            else if (value !== undefined) {
                result[name] = value;
            }
        }));
        if (hasErrors) {
            const propertyName = (status === null || status === void 0 ? void 0 : status.properties) ? ` ${status.properties.join('.')}` : '';
            throw new errors_1.BadRequest('Error resolving data' + (propertyName ? ` ${propertyName}` : ''), errors);
        }
        return schema && validate === 'after' ? await schema.validate(result) : result;
    }
}
exports.Resolver = Resolver;
function resolve(options) {
    return new Resolver(options);
}
exports.resolve = resolve;
//# sourceMappingURL=resolver.js.map