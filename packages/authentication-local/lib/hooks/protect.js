"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const omit_1 = __importDefault(require("lodash/omit"));
/**
 * @deprecated For reliable safe data representations use Feathers schema dispatch resolvers.
 * See https://dove.docs.feathersjs.com/api/schema/resolvers.html#safe-data-resolvers for more information.
 */
exports.default = (...fields) => {
    const o = (current) => {
        if (typeof current === 'object' && !Array.isArray(current)) {
            const data = typeof current.toJSON === 'function' ? current.toJSON() : current;
            return (0, omit_1.default)(data, fields);
        }
        return current;
    };
    return async (context, next) => {
        if (typeof next === 'function') {
            await next();
        }
        const result = context.dispatch || context.result;
        if (result) {
            if (Array.isArray(result)) {
                context.dispatch = result.map(o);
            }
            else if (result.data && context.method === 'find') {
                context.dispatch = Object.assign({}, result, {
                    data: result.data.map(o)
                });
            }
            else {
                context.dispatch = o(result);
            }
            if (context.params && context.params.provider) {
                context.result = context.dispatch;
            }
        }
    };
};
//# sourceMappingURL=protect.js.map