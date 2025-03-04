export declare function stripSlashes(name: string): string;
export declare type KeyValueCallback<T> = (value: any, key: string) => T;
export declare const _: {
    each(obj: any, callback: KeyValueCallback<void>): void;
    some(value: any, callback: KeyValueCallback<boolean>): boolean;
    every(value: any, callback: KeyValueCallback<boolean>): boolean;
    keys(obj: any): string[];
    values(obj: any): any[];
    isMatch(obj: any, item: any): boolean;
    isEmpty(obj: any): boolean;
    isObject(item: any): boolean;
    isObjectOrArray(value: any): boolean;
    extend(first: any, ...rest: any[]): any;
    omit(obj: any, ...keys: string[]): any;
    pick(source: any, ...keys: string[]): {
        [key: string]: any;
    };
    merge(target: any, source: any): any;
};
export declare function isPromise(result: any): boolean;
export declare function createSymbol(name: string): string | symbol;
export * from './debug';
