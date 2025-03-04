import { Query } from '@feathersjs/feathers';
import { FilterQueryOptions, FilterSettings } from './declarations';
export declare const OPERATORS: string[];
export declare const FILTERS: FilterSettings;
/**
 * Converts Feathers special query parameters and pagination settings
 * and returns them separately as `filters` and the rest of the query
 * as `query`. `options` also gets passed the pagination settings and
 * a list of additional `operators` to allow when querying properties.
 *
 * @param query The initial query
 * @param options Options for filtering the query
 * @returns An object with `query` which contains the query without `filters`
 * and `filters` which contains the converted values for each filter.
 */
export declare function filterQuery(_query: Query, options?: FilterQueryOptions): {
    filters: {
        [key: string]: any;
    };
    query: Query;
};
