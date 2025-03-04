import { HookContext, NextFunction } from '@feathersjs/feathers';
import { Resolver } from '../resolver';
export declare type ResolverSetting<H extends HookContext> = Resolver<any, H> | Resolver<any, H>[];
export declare type DataResolvers<H extends HookContext> = {
    create: Resolver<any, H>;
    patch: Resolver<any, H>;
    update: Resolver<any, H>;
};
export declare type ResolveAllSettings<H extends HookContext> = {
    data?: DataResolvers<H>;
    query?: Resolver<any, H>;
    result?: Resolver<any, H>;
    dispatch?: Resolver<any, H>;
};
export declare const DISPATCH: unique symbol;
export declare const getDispatch: (value: any) => any;
export declare const resolveQuery: <T, H extends HookContext<import("@feathersjs/feathers").Application<any, any>, any>>(...resolvers: Resolver<T, H>[]) => (context: H, next?: NextFunction) => Promise<any>;
export declare const resolveData: <H extends HookContext<import("@feathersjs/feathers").Application<any, any>, any>>(settings: DataResolvers<H> | Resolver<any, H>) => (context: H, next?: NextFunction) => Promise<any>;
export declare const resolveResult: <T, H extends HookContext<import("@feathersjs/feathers").Application<any, any>, any>>(...resolvers: Resolver<T, H>[]) => (context: H, next?: NextFunction) => Promise<void>;
export declare const resolveDispatch: <T, H extends HookContext<import("@feathersjs/feathers").Application<any, any>, any>>(...resolvers: Resolver<T, H>[]) => (context: H, next?: NextFunction) => Promise<void>;
export declare const resolveAll: <H extends HookContext<import("@feathersjs/feathers").Application<any, any>, any>>(map: ResolveAllSettings<H>) => (this: any, context: H, next?: import("@feathersjs/hooks").AsyncMiddleware<H>) => Promise<any>;
