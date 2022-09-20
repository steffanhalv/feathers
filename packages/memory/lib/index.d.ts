import { AdapterBase, AdapterServiceOptions, PaginationOptions, AdapterParams } from '@feathersjs/adapter-commons';
import { NullableId, Id, Params, ServiceMethods, Paginated } from '@feathersjs/feathers';
export interface MemoryServiceStore<T> {
    [key: string]: T;
}
export interface MemoryServiceOptions<T = any> extends AdapterServiceOptions {
    store?: MemoryServiceStore<T>;
    startId?: number;
    matcher?: (query: any) => any;
    sorter?: (sort: any) => any;
}
export declare class MemoryAdapter<T = any, D = Partial<T>, P extends Params = Params> extends AdapterBase<T, D, P, MemoryServiceOptions<T>> {
    store: MemoryServiceStore<T>;
    _uId: number;
    constructor(options?: MemoryServiceOptions<T>);
    getEntries(_params?: P): Promise<T[]>;
    getQuery(params: P): {
        query: {
            [key: string]: any;
        };
        filters: {
            $skip: any;
            $sort: any;
            $limit: any;
            $select: any;
        };
    };
    $find(_params?: P & {
        paginate?: PaginationOptions;
    }): Promise<Paginated<T>>;
    $find(_params?: P & {
        paginate: false;
    }): Promise<T[]>;
    $find(_params?: P): Promise<Paginated<T> | T[]>;
    $get(id: Id, params?: P): Promise<T>;
    $create(data: Partial<D>, params?: P): Promise<T>;
    $create(data: Partial<D>[], params?: P): Promise<T[]>;
    $create(data: Partial<D> | Partial<D>[], _params?: P): Promise<T | T[]>;
    $update(id: Id, data: D, params?: P): Promise<T>;
    $patch(id: null, data: Partial<D>, params?: P): Promise<T[]>;
    $patch(id: Id, data: Partial<D>, params?: P): Promise<T>;
    $patch(id: NullableId, data: Partial<D>, _params?: P): Promise<T | T[]>;
    $remove(id: null, params?: P): Promise<T[]>;
    $remove(id: Id, params?: P): Promise<T>;
    $remove(id: NullableId, _params?: P): Promise<T | T[]>;
}
export declare class MemoryService<T = any, D = Partial<T>, P extends AdapterParams = AdapterParams> extends MemoryAdapter<T, D, P> implements ServiceMethods<T | Paginated<T>, D, P> {
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
export declare function memory<T = any, D = Partial<T>, P extends Params = Params>(options?: Partial<MemoryServiceOptions<T>>): MemoryService<T, D, P>;
