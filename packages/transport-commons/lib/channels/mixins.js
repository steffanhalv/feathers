"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishMixin = exports.channelMixin = exports.keys = void 0;
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
const feathers_1 = require("@feathersjs/feathers");
const commons_1 = require("@feathersjs/commons");
const base_1 = require("./channel/base");
const combined_1 = require("./channel/combined");
const debug = (0, commons_1.createDebug)('@feathersjs/transport-commons/channels/mixins');
const PUBLISHERS = Symbol('@feathersjs/transport-commons/publishers');
const CHANNELS = Symbol('@feathersjs/transport-commons/channels');
const ALL_EVENTS = Symbol('@feathersjs/transport-commons/all-events');
exports.keys = {
    PUBLISHERS: PUBLISHERS,
    CHANNELS: CHANNELS,
    ALL_EVENTS: ALL_EVENTS
};
function channelMixin() {
    const mixin = {
        [CHANNELS]: {},
        channel(...names) {
            debug('Returning channels', names);
            if (names.length === 0) {
                throw new Error('app.channel needs at least one channel name');
            }
            if (names.length === 1) {
                const [name] = names;
                if (Array.isArray(name)) {
                    return this.channel(...name);
                }
                if (!this[CHANNELS][name]) {
                    const channel = new base_1.Channel();
                    channel.once('empty', () => {
                        channel.removeAllListeners();
                        delete this[CHANNELS][name];
                    });
                    this[CHANNELS][name] = channel;
                }
                return this[CHANNELS][name];
            }
            const channels = names.map((name) => this.channel(name));
            return new combined_1.CombinedChannel(channels);
        }
    };
    return mixin;
}
exports.channelMixin = channelMixin;
function publishMixin() {
    const result = {
        [PUBLISHERS]: {},
        publish(...args) {
            return this.registerPublisher(...args);
        },
        registerPublisher(event, publisher) {
            debug('Registering publisher', event);
            if (!publisher && typeof event === 'function') {
                publisher = event;
                event = ALL_EVENTS;
            }
            const { serviceEvents } = (0, feathers_1.getServiceOptions)(this);
            if (event !== ALL_EVENTS && !serviceEvents.includes(event)) {
                throw new Error(`'${event.toString()}' is not a valid service event`);
            }
            const publishers = this[PUBLISHERS];
            publishers[event] = publisher;
            return this;
        }
    };
    return result;
}
exports.publishMixin = publishMixin;
//# sourceMappingURL=mixins.js.map