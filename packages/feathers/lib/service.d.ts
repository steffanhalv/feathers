import { ServiceOptions } from './declarations';
export declare const SERVICE: string | symbol;
export declare const defaultServiceArguments: {
    find: string[];
    get: string[];
    create: string[];
    update: string[];
    patch: string[];
    remove: string[];
};
export declare const defaultServiceMethods: string[];
export declare const defaultEventMap: {
    create: string;
    update: string;
    patch: string;
    remove: string;
};
export declare const protectedMethods: string[];
export declare function getHookMethods(service: any, options: ServiceOptions): string[];
export declare function getServiceOptions(service: any, options?: ServiceOptions): ServiceOptions;
export declare function wrapService(location: string, service: any, options: ServiceOptions): any;
