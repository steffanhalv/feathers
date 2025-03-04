"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("@feathersjs/errors");
const errorHandler = () => async (ctx, next) => {
    try {
        await next();
        if (ctx.body === undefined) {
            throw new errors_1.NotFound('Not Found');
        }
    }
    catch (error) {
        ctx.response.status = error.code || 500;
        ctx.body =
            typeof error.toJSON === 'function'
                ? error.toJSON()
                : {
                    message: error.message
                };
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=handlers.js.map