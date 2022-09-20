"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@feathersjs/transport-commons/client");
const feathers_1 = require("@feathersjs/feathers");
function socketioClient(connection, options) {
    if (!connection) {
        throw new Error('Socket.io connection needs to be provided');
    }
    const defaultService = function (name) {
        const events = Object.values(feathers_1.defaultEventMap);
        const settings = Object.assign({}, options, {
            events,
            name,
            connection,
            method: 'emit'
        });
        return new client_1.Service(settings);
    };
    const initialize = function (app) {
        if (app.io !== undefined) {
            throw new Error('Only one default client provider can be configured');
        }
        app.io = connection;
        app.defaultService = defaultService;
        app.mixins.unshift((service, _location, options) => {
            if (options && options.methods && service instanceof client_1.Service) {
                const customMethods = options.methods.filter((name) => !feathers_1.defaultServiceMethods.includes(name));
                service.methods(...customMethods);
            }
        });
    };
    initialize.Service = client_1.Service;
    initialize.service = defaultService;
    return initialize;
}
exports.default = socketioClient;
if (typeof module !== 'undefined') {
    module.exports = Object.assign(socketioClient, module.exports);
}
//# sourceMappingURL=index.js.map