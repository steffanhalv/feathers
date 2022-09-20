import { Id, NullableId, Paginated, Query } from '@feathersjs/feathers';
import { AdapterBase, PaginationOptions } from '@feathersjs/adapter-commons';
import { Knex } from 'knex';
import { KnexAdapterOptions, KnexAdapterParams } from './declarations';
export declare class KnexAdapter<T, D = Partial<T>, P extends KnexAdapterParams<any> = KnexAdapterParams> extends AdapterBase<T, D, P, KnexAdapterOptions> {
    table: string;
    schema?: string;
    constructor(options: KnexAdapterOptions);
    get Model(): Knex<any, any[]>;
    get fullName(): string;
    db(params?: P): Knex.QueryBuilder<any, any>;
    knexify(knexQuery: Knex.QueryBuilder, query?: Query, parentKey?: string): Knex.QueryBuilder;
    createQuery(params: P): Knex.QueryBuilder<any, any>;
    filterQuery(params: P): {
        filters: {
            [key: string]: any;
        };
        query: Query;
        paginate: import("@feathersjs/adapter-commons").PaginationParams;
    };
    $find(params?: P & {
        paginate?: PaginationOptions;
    }): Promise<Paginated<T>>;
    $find(params?: P & {
        paginate: false;
    }): Promise<T[]>;
    $find(params?: P): Promise<Paginated<T> | T[]>;
    _findOrGet(id: NullableId, params?: P): Promise<T[]>;
    $get(id: Id, params?: P): Promise<T>;
    $create(data: Partial<D>, params?: P): Promise<T>;
    $create(data: Partial<D>[], params?: P): Promise<T[]>;
    $create(data: Partial<D> | Partial<D>[], _params?: P): Promise<T | T[]>;
    $patch(id: null, data: Partial<D>, params?: P): Promise<T[]>;
    $patch(id: Id, data: Partial<D>, params?: P): Promise<T>;
    $patch(id: NullableId, data: Partial<D>, _params?: P): Promise<T | T[]>;
    $update(id: Id, _data: D, params?: P): Promise<T>;
    $remove(id: null, params?: P): Promise<T[]>;
    $remove(id: Id, params?: P): Promise<T>;
    $remove(id: NullableId, _params?: P): Promise<T | T[]>;
}
