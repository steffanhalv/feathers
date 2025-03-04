import { AuthenticationClient, AuthenticationClientOptions } from './core';
import * as hooks from './hooks';
import { Application } from '@feathersjs/feathers';
import { Storage, MemoryStorage, StorageWrapper } from './storage';
declare module '@feathersjs/feathers/lib/declarations' {
    interface Application<Services, Settings> {
        io?: any;
        rest?: any;
        authentication: AuthenticationClient;
        authenticate: AuthenticationClient['authenticate'];
        reAuthenticate: AuthenticationClient['reAuthenticate'];
        logout: AuthenticationClient['logout'];
    }
}
export declare const getDefaultStorage: () => MemoryStorage | StorageWrapper;
export { AuthenticationClient, AuthenticationClientOptions, Storage, MemoryStorage, hooks };
export declare type ClientConstructor = new (app: Application, options: AuthenticationClientOptions) => AuthenticationClient;
export declare const defaultStorage: Storage;
export declare const defaults: AuthenticationClientOptions;
declare const init: (_options?: Partial<AuthenticationClientOptions>) => (app: Application) => void;
export default init;
