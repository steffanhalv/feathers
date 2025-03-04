import { HookContextData, HookManager, Middleware } from '@feathersjs/hooks';
import { Service, ServiceOptions, HookContext, FeathersService, HookMap, AroundHookFunction, HookFunction } from './declarations';
declare type HookStore = {
    around: {
        [method: string]: AroundHookFunction[];
    };
    before: {
        [method: string]: HookFunction[];
    };
    after: {
        [method: string]: HookFunction[];
    };
    error: {
        [method: string]: HookFunction[];
    };
    collected: {
        [method: string]: AroundHookFunction[];
    };
};
declare type HookEnabled = {
    __hooks: HookStore;
};
export declare function convertHookData(input: any): {
    [method: string]: AroundHookFunction<import("./declarations").Application<any, any>, Service<any, Partial<any>, import("./declarations").Params<import("./declarations").Query>>>[] | HookFunction<import("./declarations").Application<any, any>, Service<any, Partial<any>, import("./declarations").Params<import("./declarations").Query>>>[];
};
export declare function collectHooks(target: HookEnabled, method: string): AroundHookFunction<import("./declarations").Application<any, any>, Service<any, Partial<any>, import("./declarations").Params<import("./declarations").Query>>>[];
export declare function enableHooks(object: any): (this: HookEnabled, input: HookMap<any, any>) => HookEnabled;
export declare function createContext(service: Service, method: string, data?: HookContextData): HookContext<import("./declarations").Application<any, any>, any>;
export declare class FeathersHookManager<A> extends HookManager {
    app: A;
    method: string;
    constructor(app: A, method: string);
    collectMiddleware(self: any, args: any[]): Middleware[];
    initializeContext(self: any, args: any[], context: HookContext): import("@feathersjs/hooks").HookContext<any, any>;
    middleware(mw: Middleware[]): this;
}
export declare function hookMixin<A>(this: A, service: FeathersService<A>, path: string, options: ServiceOptions): FeathersService<A, Service<any, Partial<any>, import("./declarations").Params<import("./declarations").Query>>>;
export {};
