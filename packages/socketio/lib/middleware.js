"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = exports.params = exports.disconnect = void 0;
const commons_1 = require("@feathersjs/commons");
const debug = (0, commons_1.createDebug)('@feathersjs/socketio/middleware');
const disconnect = (app, getParams) => (socket, next) => {
    socket.once('disconnect', () => app.emit('disconnect', getParams(socket)));
    next();
};
exports.disconnect = disconnect;
const params = (_app, socketMap) => (socket, next) => {
    socket.feathers = {
        provider: 'socketio',
        headers: socket.handshake.headers
    };
    socketMap.set(socket.feathers, socket);
    next();
};
exports.params = params;
const authentication = (app, getParams, settings = {}) => (socket, next) => {
    const service = app.defaultAuthentication
        ? app.defaultAuthentication(settings.service)
        : null;
    if (service === null) {
        return next();
    }
    const config = service.configuration;
    const authStrategies = config.parseStrategies || config.authStrategies || [];
    if (authStrategies.length === 0) {
        return next();
    }
    service
        .parse(socket.handshake, null, ...authStrategies)
        .then(async (authentication) => {
        if (authentication) {
            debug('Parsed authentication from HTTP header', authentication);
            socket.feathers.authentication = authentication;
            await service.create(authentication, {
                provider: 'socketio',
                connection: getParams(socket)
            });
        }
        next();
    })
        .catch(next);
};
exports.authentication = authentication;
//# sourceMappingURL=middleware.js.map