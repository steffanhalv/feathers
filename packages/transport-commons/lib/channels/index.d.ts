/// <reference types="node" />
import { Application } from '@feathersjs/feathers';
import { Channel, RealTimeConnection } from './channel/base';
import { CombinedChannel } from './channel/combined';
import { keys, Event, Publisher } from './mixins';
import EventEmitter from 'events';
declare module '@feathersjs/feathers/lib/declarations' {
    interface ServiceAddons<A, S> extends EventEmitter {
        publish(publisher: Publisher<ServiceGenericType<S>, A, this>): this;
        publish(event: Event, publisher: Publisher<ServiceGenericType<S>, A, this>): this;
        registerPublisher(publisher: Publisher<ServiceGenericType<S>, A, this>): this;
        registerPublisher(event: Event, publisher: Publisher<ServiceGenericType<S>, A, this>): this;
    }
    interface Application<Services, Settings> {
        channels: string[];
        channel(name: string | string[]): Channel;
        channel(...names: string[]): Channel;
        publish<T>(publisher: Publisher<T, this>): this;
        publish<T>(event: Event, publisher: Publisher<T, this>): this;
        registerPublisher<T>(publisher: Publisher<T, this>): this;
        registerPublisher<T>(event: Event, publisher: Publisher<T, this>): this;
    }
    interface Params {
        connection?: RealTimeConnection;
    }
}
export { keys };
export declare function channels(): (app: Application) => void;
export { Channel, CombinedChannel, RealTimeConnection };
