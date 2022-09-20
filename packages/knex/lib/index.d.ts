import { PaginationOptions } from '@feathersjs/adapter-commons';
import { Paginated, ServiceMethods, Id } from '@feathersjs/feathers';
import { KnexAdapter } from './adapter';
import { KnexAdapterParams } from './declarations';
export * from './declarations';
export * from './adapter';
export * from './error-handler';
export * as transaction from './hooks';
export declare class KnexService<T = any, D = Partial<T>, P extends KnexAdapterParams<any> = KnexAdapterParams> extends KnexAdapter<T, D, P> implements ServiceMethods<T | Paginated<T>, D, P> {
    find(params?: P & {
        paginate?: PaginationOptions;
    }): Promise<Paginated<T>>;
    find(params?: P & {
        paginate: false;
    }): Promise<T[]>;
    find(params?: P): Promise<Paginated<T> | T[]>;
    get(id: Id, params?: P): Promise<T>;
    create(data: Partial<D>, params?: P): Promise<T>;
    create(data: Partial<D>[], params?: P): Promise<T[]>;
    update(id: Id, data: D, params?: P): Promise<T>;
    patch(id: Id, data: Partial<D>, params?: P): Promise<T>;
    patch(id: null, data: Partial<D>, params?: P): Promise<T[]>;
    remove(id: Id, params?: P): Promise<T>;
    remove(id: null, params?: P): Promise<T[]>;
}
