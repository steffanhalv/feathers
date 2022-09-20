import { ObjectId, Collection, FindOptions, BulkWriteOptions, InsertOneOptions, DeleteOptions, CountDocumentsOptions, ReplaceOptions } from 'mongodb';
import { AdapterBase, AdapterParams, AdapterServiceOptions, PaginationOptions, AdapterQuery } from '@feathersjs/adapter-commons';
import { NullableId, Id, Paginated } from '@feathersjs/feathers';
export interface MongoDBAdapterOptions extends AdapterServiceOptions {
    Model: Collection | Promise<Collection>;
    disableObjectify?: boolean;
    useEstimatedDocumentCount?: boolean;
}
export interface MongoDBAdapterParams<Q = AdapterQuery> extends AdapterParams<Q, Partial<MongoDBAdapterOptions>> {
    mongodb?: BulkWriteOptions | FindOptions | InsertOneOptions | DeleteOptions | CountDocumentsOptions | ReplaceOptions;
}
export declare class MongoDbAdapter<T, D = Partial<T>, P extends MongoDBAdapterParams<any> = MongoDBAdapterParams> extends AdapterBase<T, D, P, MongoDBAdapterOptions> {
    constructor(options: MongoDBAdapterOptions);
    getObjectId(id: Id | ObjectId): Id | ObjectId;
    filterQuery(id: NullableId, params: P): {
        filters: {
            $select: string[];
            $sort: {
                [key: string]: 1 | -1;
            };
            $limit: number;
            $skip: number;
        };
        query: {
            [key: string]: any;
        };
    };
    getSelect(select: string[] | {
        [key: string]: number;
    }): {
        [key: string]: number;
    };
    $findOrGet(id: NullableId, params: P): Promise<T | Paginated<T> | T[]>;
    normalizeId(id: NullableId, data: Partial<D>): Partial<D>;
    $get(id: Id, params?: P): Promise<T>;
    $find(params?: P & {
        paginate?: PaginationOptions;
    }): Promise<Paginated<T>>;
    $find(params?: P & {
        paginate: false;
    }): Promise<T[]>;
    $find(params?: P): Promise<Paginated<T> | T[]>;
    $create(data: Partial<D>, params?: P): Promise<T>;
    $create(data: Partial<D>[], params?: P): Promise<T[]>;
    $create(data: Partial<D> | Partial<D>[], _params?: P): Promise<T | T[]>;
    $patch(id: null, data: Partial<D>, params?: P): Promise<T[]>;
    $patch(id: Id, data: Partial<D>, params?: P): Promise<T>;
    $patch(id: NullableId, data: Partial<D>, _params?: P): Promise<T | T[]>;
    $update(id: Id, data: D, params?: P): Promise<T>;
    $remove(id: null, params?: P): Promise<T[]>;
    $remove(id: Id, params?: P): Promise<T>;
    $remove(id: NullableId, _params?: P): Promise<T | T[]>;
}
