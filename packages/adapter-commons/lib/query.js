"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterQuery = exports.FILTERS = exports.OPERATORS = void 0;
const commons_1 = require("@feathersjs/commons");
const errors_1 = require("@feathersjs/errors");
const parse = (value) => (typeof value !== 'undefined' ? parseInt(value, 10) : value);
const isPlainObject = (value) => commons_1._.isObject(value) && value.constructor === {}.constructor;
const validateQueryProperty = (query, operators = []) => {
    if (!isPlainObject(query)) {
        return query;
    }
    for (const key of Object.keys(query)) {
        if (key.startsWith('$') && !operators.includes(key)) {
            throw new errors_1.BadRequest(`Invalid query parameter ${key}`, query);
        }
        const value = query[key];
        if (isPlainObject(value)) {
            query[key] = validateQueryProperty(value, operators);
        }
    }
    return {
        ...query
    };
};
const getFilters = (query, settings) => {
    const filterNames = Object.keys(settings.filters);
    return filterNames.reduce((current, key) => {
        const queryValue = query[key];
        const filter = settings.filters[key];
        if (filter) {
            const value = typeof filter === 'function' ? filter(queryValue, settings) : queryValue;
            if (value !== undefined) {
                current[key] = value;
            }
        }
        return current;
    }, {});
};
const getQuery = (query, settings) => {
    const keys = Object.keys(query).concat(Object.getOwnPropertySymbols(query));
    return keys.reduce((result, key) => {
        if (typeof key === 'string' && key.startsWith('$')) {
            if (settings.filters[key] === undefined) {
                throw new errors_1.BadRequest(`Invalid filter value ${key}`);
            }
        }
        else {
            result[key] = validateQueryProperty(query[key], settings.operators);
        }
        return result;
    }, {});
};
exports.OPERATORS = ['$in', '$nin', '$lt', '$lte', '$gt', '$gte', '$ne', '$or'];
exports.FILTERS = {
    $skip: (value) => parse(value),
    $sort: (sort) => {
        if (typeof sort !== 'object' || Array.isArray(sort)) {
            return sort;
        }
        return Object.keys(sort).reduce((result, key) => {
            result[key] = typeof sort[key] === 'object' ? sort[key] : parse(sort[key]);
            return result;
        }, {});
    },
    $limit: (_limit, { paginate }) => {
        const limit = parse(_limit);
        if (paginate && (paginate.default || paginate.max)) {
            const base = paginate.default || 0;
            const lower = typeof limit === 'number' && !isNaN(limit) && limit >= 0 ? limit : base;
            const upper = typeof paginate.max === 'number' ? paginate.max : Number.MAX_VALUE;
            return Math.min(lower, upper);
        }
        return limit;
    },
    $select: (select) => {
        if (Array.isArray(select)) {
            return select.map((current) => `${current}`);
        }
        return select;
    },
    $or: (or, { operators }) => {
        if (Array.isArray(or)) {
            return or.map((current) => validateQueryProperty(current, operators));
        }
        return or;
    }
};
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
function filterQuery(_query, options = {}) {
    const query = _query || {};
    const settings = {
        ...options,
        filters: {
            ...exports.FILTERS,
            ...options.filters
        },
        operators: exports.OPERATORS.concat(options.operators || [])
    };
    return {
        filters: getFilters(query, settings),
        query: getQuery(query, settings)
    };
}
exports.filterQuery = filterQuery;
//# sourceMappingURL=query.js.map