import { Application, HookContext } from '@feathersjs/feathers';
import { Channel } from './channel/base';
declare const PUBLISHERS: unique symbol;
declare const CHANNELS: unique symbol;
declare const ALL_EVENTS: unique symbol;
export declare const keys: {
    PUBLISHERS: typeof PUBLISHERS;
    CHANNELS: typeof CHANNELS;
    ALL_EVENTS: typeof ALL_EVENTS;
};
export interface ChannelMixin {
    [CHANNELS]: {
        [key: string]: Channel;
    };
    channel(...names: string[]): Channel;
}
export declare function channelMixin(): ChannelMixin;
export declare type Event = string | typeof ALL_EVENTS;
export declare type Publisher<T = any, A = Application, S = any> = (data: T, context: HookContext<A, S>) => Channel | Channel[] | void | Promise<Channel | Channel[] | void>;
export interface PublishMixin<T = any> {
    [PUBLISHERS]: {
        [ALL_EVENTS]?: Publisher<T>;
        [key: string]: Publisher<T>;
    };
    publish(event: Event, publisher: Publisher<T>): this;
    registerPublisher(event: Event, publisher: Publisher<T>): this;
}
export declare function publishMixin(): PublishMixin<any>;
export {};
