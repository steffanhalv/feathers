/// <reference types="node" />
import Koa, { Next } from 'koa';
import { Server } from 'http';
import { Application as FeathersApplication, HookContext, Params, RouteLookup } from '@feathersjs/feathers';
import '@feathersjs/authentication';
export declare type ApplicationAddons = {
    server: Server;
    listen(port?: number, ...args: any[]): Promise<Server>;
};
export declare type Application<T = any, C = any> = Omit<Koa, 'listen'> & FeathersApplication<T, C> & ApplicationAddons;
export declare type FeathersKoaContext<A = Application> = Koa.Context & {
    app: A;
};
export declare type Middleware<A = Application> = (context: FeathersKoaContext<A>, next: Next) => any;
declare module '@feathersjs/feathers/lib/declarations' {
    interface ServiceOptions {
        koa?: {
            before?: Middleware[];
            after?: Middleware[];
            composed?: Middleware;
        };
    }
}
declare module 'koa' {
    interface ExtendableContext {
        feathers?: Partial<Params>;
        lookup?: RouteLookup;
        hook?: HookContext;
    }
}
