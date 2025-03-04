"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMethod = exports.getDispatcher = exports.normalizeError = exports.paramsPositions = exports.DEFAULT_PARAMS_POSITION = void 0;
const feathers_1 = require("@feathersjs/feathers");
const errors_1 = require("@feathersjs/errors");
const commons_1 = require("@feathersjs/commons");
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const debug = (0, commons_1.createDebug)('@feathersjs/transport-commons');
exports.DEFAULT_PARAMS_POSITION = 1;
exports.paramsPositions = {
    find: 0,
    update: 2,
    patch: 2
};
function normalizeError(e) {
    const hasToJSON = typeof e.toJSON === 'function';
    const result = hasToJSON ? e.toJSON() : {};
    if (!hasToJSON) {
        Object.getOwnPropertyNames(e).forEach((key) => {
            result[key] = e[key];
        });
    }
    if (process.env.NODE_ENV === 'production') {
        delete result.stack;
    }
    delete result.hook;
    return result;
}
exports.normalizeError = normalizeError;
function getDispatcher(emit, socketMap, socketKey) {
    return function (event, channel, context, data) {
        debug(`Dispatching '${event}' to ${channel.length} connections`);
        channel.connections.forEach((connection) => {
            // The reference between connection and socket is set in `app.setup`
            const socket = socketKey ? connection[socketKey] : socketMap.get(connection);
            if (socket) {
                const eventName = `${context.path || ''} ${event}`.trim();
                let result = channel.dataFor(connection) || context.dispatch || context.result;
                // If we are getting events from an array but try to dispatch individual data
                // try to get the individual item to dispatch from the correct index.
                if (!Array.isArray(data) && Array.isArray(context.result) && Array.isArray(result)) {
                    result = context.result.find((resultData) => (0, isEqual_1.default)(resultData, data));
                }
                debug(`Dispatching '${eventName}' to Socket ${socket.id} with`, result);
                socket[emit](eventName, result);
            }
        });
    };
}
exports.getDispatcher = getDispatcher;
async function runMethod(app, connection, path, method, args) {
    const trace = `method '${method}' on service '${path}'`;
    const methodArgs = args.slice(0);
    const callback = 
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    typeof methodArgs[methodArgs.length - 1] === 'function' ? methodArgs.pop() : function () { };
    debug(`Running ${trace}`, connection, args);
    const handleError = (error) => {
        debug(`Error in ${trace}`, error);
        callback(normalizeError(error));
    };
    try {
        const lookup = app.lookup(path);
        // No valid service was found throw a NotFound error
        if (lookup === null) {
            throw new errors_1.NotFound(`Service '${path}' not found`);
        }
        const { service, params: route = {} } = lookup;
        const { methods } = (0, feathers_1.getServiceOptions)(service);
        // Only service methods are allowed
        if (!methods.includes(method)) {
            throw new errors_1.MethodNotAllowed(`Method '${method}' not allowed on service '${path}'`);
        }
        const position = exports.paramsPositions[method] !== undefined ? exports.paramsPositions[method] : exports.DEFAULT_PARAMS_POSITION;
        const query = Object.assign({}, methodArgs[position]);
        // `params` have to be re-mapped to the query and added with the route
        const params = Object.assign({ query, route, connection }, connection);
        // `params` is always the last parameter. Error if we got more arguments.
        if (methodArgs.length > position + 1) {
            throw new errors_1.BadRequest(`Too many arguments for '${method}' method`);
        }
        methodArgs[position] = params;
        const ctx = (0, feathers_1.createContext)(service, method);
        const returnedCtx = await service[method](...methodArgs, ctx);
        const result = returnedCtx.dispatch || returnedCtx.result;
        debug(`Returned successfully ${trace}`, result);
        callback(null, result);
    }
    catch (error) {
        handleError(error);
    }
}
exports.runMethod = runMethod;
//# sourceMappingURL=utils.js.map