"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinedChannel = void 0;
const base_1 = require("./base");
function collectConnections(children) {
    const mappings = new WeakMap();
    const connections = [];
    children.forEach((channel) => {
        channel.connections.forEach((connection) => {
            if (!mappings.has(connection)) {
                connections.push(connection);
                mappings.set(connection, channel.data);
            }
        });
    });
    return { connections, mappings };
}
class CombinedChannel extends base_1.Channel {
    constructor(children, data = null) {
        const { mappings, connections } = collectConnections(children);
        super(connections, data);
        this.children = children;
        this.mappings = mappings;
    }
    refresh() {
        const collected = collectConnections(this.children);
        return Object.assign(this, collected);
    }
    leave(...connections) {
        return this.callChildren('leave', connections);
    }
    join(...connections) {
        return this.callChildren('join', connections);
    }
    dataFor(connection) {
        return this.mappings.get(connection);
    }
    callChildren(method, connections) {
        this.children.forEach((child) => child[method](...connections));
        this.refresh();
        return this;
    }
}
exports.CombinedChannel = CombinedChannel;
//# sourceMappingURL=combined.js.map