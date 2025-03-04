"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const commons_1 = require("@feathersjs/commons");
const transport_commons_1 = require("@feathersjs/transport-commons");
const hooks_1 = require("@feathersjs/hooks");
const middleware_1 = require("./middleware");
const debug = (0, commons_1.createDebug)('@feathersjs/socketio');
function configureSocketio(port, options, config) {
    if (typeof port !== 'number') {
        config = options;
        options = port;
        port = null;
    }
    if (typeof options !== 'object') {
        config = options;
        options = {};
    }
    return (app) => {
        // Function that gets the connection
        const getParams = (socket) => socket.feathers;
        // A mapping from connection to socket instance
        const socketMap = new WeakMap();
        // Promise that resolves with the Socket.io `io` instance
        // when `setup` has been called (with a server)
        const done = new Promise((resolve) => {
            const { listen, setup } = app;
            Object.assign(app, {
                async listen(...args) {
                    if (typeof listen === 'function') {
                        // If `listen` already exists
                        // usually the case when the app has been expressified
                        return listen.call(this, ...args);
                    }
                    const server = http_1.default.createServer();
                    await this.setup(server);
                    return server.listen(...args);
                },
                async setup(server, ...rest) {
                    if (!this.io) {
                        const io = (this.io = new socket_io_1.Server(port || server, options));
                        io.use((0, middleware_1.disconnect)(app, getParams));
                        io.use((0, middleware_1.params)(app, socketMap));
                        io.use((0, middleware_1.authentication)(app, getParams));
                        // In Feathers it is easy to hit the standard Node warning limit
                        // of event listeners (e.g. by registering 10 services).
                        // So we set it to a higher number. 64 should be enough for everyone.
                        io.sockets.setMaxListeners(64);
                    }
                    if (typeof config === 'function') {
                        debug('Calling SocketIO configuration function');
                        config.call(this, this.io);
                    }
                    resolve(this.io);
                    return setup.call(this, server, ...rest);
                }
            });
            (0, hooks_1.hooks)(app, {
                setup: (0, hooks_1.middleware)().params('server').props({ app })
            });
        });
        app.configure((0, transport_commons_1.socket)({
            done,
            socketMap,
            getParams,
            emit: 'emit'
        }));
    };
}
module.exports = configureSocketio;
//# sourceMappingURL=index.js.map