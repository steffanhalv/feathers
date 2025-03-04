"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnexAdapter = void 0;
const commons_1 = require("@feathersjs/commons");
const adapter_commons_1 = require("@feathersjs/adapter-commons");
const errors_1 = require("@feathersjs/errors");
const error_handler_1 = require("./error-handler");
const METHODS = {
    $ne: 'whereNot',
    $in: 'whereIn',
    $nin: 'whereNotIn',
    $or: 'orWhere',
    $and: 'andWhere'
};
const OPERATORS = {
    $lt: '<',
    $lte: '<=',
    $gt: '>',
    $gte: '>=',
    $like: 'like',
    $notlike: 'not like',
    $ilike: 'ilike'
};
const RETURNING_CLIENTS = ['postgresql', 'pg', 'oracledb', 'mssql'];
class KnexAdapter extends adapter_commons_1.AdapterBase {
    constructor(options) {
        if (!options || !options.Model) {
            throw new Error('You must provide a Model (the initialized knex object)');
        }
        if (typeof options.name !== 'string') {
            throw new Error('No table name specified.');
        }
        super({
            id: 'id',
            ...options,
            filters: {
                ...options.filters,
                $and: (value) => value
            },
            operators: [...(options.operators || []), '$like', '$notlike', '$ilike', '$and', '$or']
        });
        this.table = options.name;
        this.schema = options.schema;
    }
    get Model() {
        return this.options.Model;
    }
    get fullName() {
        return this.schema ? `${this.schema}.${this.table}` : this.table;
    }
    db(params) {
        const { Model, table, schema } = this;
        if (params && params.transaction && params.transaction.trx) {
            const { trx } = params.transaction;
            // debug('ran %s with transaction %s', fullName, id)
            return schema ? trx.withSchema(schema).table(table) : trx(table);
        }
        return schema ? Model.withSchema(schema).table(table) : Model(table);
    }
    knexify(knexQuery, query = {}, parentKey) {
        const knexify = this.knexify.bind(this);
        return Object.keys(query || {}).reduce((currentQuery, key) => {
            const value = query[key];
            if (commons_1._.isObject(value)) {
                return knexify(currentQuery, value, key);
            }
            const column = parentKey || key;
            const method = METHODS[key];
            if (method) {
                if (key === '$or' || key === '$and') {
                    // This will create a nested query
                    currentQuery.where(function () {
                        for (const condition of value) {
                            this[method](function () {
                                knexify(this, condition);
                            });
                        }
                    });
                    return currentQuery;
                }
                return currentQuery[method](column, value);
            }
            const operator = OPERATORS[key] || '=';
            return operator === '='
                ? currentQuery.where(column, value)
                : currentQuery.where(column, operator, value);
        }, knexQuery);
    }
    createQuery(params) {
        const { table, id } = this;
        const { filters, query } = this.filterQuery(params);
        const builder = this.db(params);
        // $select uses a specific find syntax, so it has to come first.
        if (filters.$select) {
            // always select the id field, but make sure we only select it once
            builder.select(...new Set([...filters.$select, `${table}.${id}`]));
        }
        else {
            builder.select(`${table}.*`);
        }
        // build up the knex query out of the query params, include $and and $or filters
        this.knexify(builder, {
            ...query,
            ...commons_1._.pick(filters, '$and', '$or')
        });
        // Handle $sort
        if (filters.$sort) {
            return Object.keys(filters.$sort).reduce((currentQuery, key) => currentQuery.orderBy(key, filters.$sort[key] === 1 ? 'asc' : 'desc'), builder);
        }
        return builder;
    }
    filterQuery(params) {
        const options = this.getOptions(params);
        const { filters, query } = (0, adapter_commons_1.filterQuery)((params === null || params === void 0 ? void 0 : params.query) || {}, options);
        return { filters, query, paginate: options.paginate };
    }
    async $find(params = {}) {
        const { filters, paginate } = this.filterQuery(params);
        const builder = params.knex ? params.knex.clone() : this.createQuery(params);
        const countBuilder = builder.clone().clearSelect().clearOrder().count(`${this.table}.${this.id} as total`);
        // Handle $limit
        if (filters.$limit) {
            builder.limit(filters.$limit);
        }
        // Handle $skip
        if (filters.$skip) {
            builder.offset(filters.$skip);
        }
        // provide default sorting if its not set
        if (!filters.$sort) {
            builder.orderBy(`${this.table}.${this.id}`, 'asc');
        }
        const data = filters.$limit === 0 ? [] : await builder.catch(error_handler_1.errorHandler);
        if (paginate && paginate.default) {
            const total = await countBuilder.then((count) => parseInt(count[0] ? count[0].total : 0));
            return {
                total,
                limit: filters.$limit,
                skip: filters.$skip || 0,
                data
            };
        }
        return data;
    }
    async _findOrGet(id, params) {
        const findParams = {
            ...params,
            paginate: false,
            query: {
                ...params === null || params === void 0 ? void 0 : params.query,
                ...(id !== null ? { [`${this.table}.${this.id}`]: id } : {})
            }
        };
        return this.$find(findParams);
    }
    async $get(id, params = {}) {
        const data = await this._findOrGet(id, params);
        if (data.length !== 1) {
            throw new errors_1.NotFound(`No record found for id '${id}'`);
        }
        return data[0];
    }
    async $create(_data, params = {}) {
        const data = _data;
        if (Array.isArray(data)) {
            return Promise.all(data.map((current) => this.$create(current, params)));
        }
        const client = this.db(params).client.config.client;
        const returning = RETURNING_CLIENTS.includes(client) ? [this.id] : [];
        const rows = await this.db(params).insert(data, returning).catch(error_handler_1.errorHandler);
        const id = data[this.id] || rows[0][this.id] || rows[0];
        if (!id) {
            return rows;
        }
        return this.$get(id, params);
    }
    async $patch(id, raw, params = {}) {
        var _a, _b;
        const data = commons_1._.omit(raw, this.id);
        const results = await this._findOrGet(id, {
            ...params,
            query: {
                ...params === null || params === void 0 ? void 0 : params.query,
                $select: [`${this.table}.${this.id}`]
            }
        });
        const idList = results.map((current) => current[this.id]);
        const updateParams = {
            ...params,
            query: {
                [`${this.table}.${this.id}`]: { $in: idList },
                ...(((_a = params === null || params === void 0 ? void 0 : params.query) === null || _a === void 0 ? void 0 : _a.$select) ? { $select: (_b = params === null || params === void 0 ? void 0 : params.query) === null || _b === void 0 ? void 0 : _b.$select } : {})
            }
        };
        const builder = this.createQuery(updateParams);
        await builder.update(data);
        const items = await this._findOrGet(null, updateParams);
        if (id !== null) {
            if (items.length === 1) {
                return items[0];
            }
            else {
                throw new errors_1.NotFound(`No record found for id '${id}'`);
            }
        }
        return items;
    }
    async $update(id, _data, params = {}) {
        const data = commons_1._.omit(_data, this.id);
        const oldData = await this.$get(id, params);
        const newObject = Object.keys(oldData).reduce((result, key) => {
            if (key !== this.id) {
                // We don't want the id field to be changed
                result[key] = data[key] === undefined ? null : data[key];
            }
            return result;
        }, {});
        await this.db(params).update(newObject, '*').where(this.id, id);
        return this.$get(id, params);
    }
    async $remove(id, params = {}) {
        const items = await this._findOrGet(id, params);
        const { query } = this.filterQuery(params);
        const q = this.db(params);
        const idList = items.map((current) => current[this.id]);
        query[this.id] = { $in: idList };
        // build up the knex query out of the query params
        this.knexify(q, query);
        await q.del().catch(error_handler_1.errorHandler);
        if (id !== null) {
            if (items.length === 1) {
                return items[0];
            }
            throw new errors_1.NotFound(`No record found for id '${id}'`);
        }
        return items;
    }
}
exports.KnexAdapter = KnexAdapter;
//# sourceMappingURL=adapter.js.map