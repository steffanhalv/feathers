import { PaginationOptions } from '@feathersjs/adapter-commons';
import { Paginated, ServiceMethods, Id } from '@feathersjs/feathers';
import { MongoDbAdapter, MongoDBAdapterParams } from './adapter';
export * from './adapter';
export * from './error-handler';
export declare class MongoDBService<T = any, D = Partial<T>, P extends MongoDBAdapterParams<any> = MongoDBAdapterParams> extends MongoDbAdapter<T, D, P> implements ServiceMethods<T | Paginated<T>, D, P> {
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
