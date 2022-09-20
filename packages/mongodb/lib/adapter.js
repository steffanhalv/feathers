"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbAdapter = void 0;
const mongodb_1 = require("mongodb");
const errors_1 = require("@feathersjs/errors");
const commons_1 = require("@feathersjs/commons");
const adapter_commons_1 = require("@feathersjs/adapter-commons");
const error_handler_1 = require("./error-handler");
// Create the service.
class MongoDbAdapter extends adapter_commons_1.AdapterBase {
    constructor(options) {
        if (!options) {
            throw new Error('MongoDB options have to be provided');
        }
        super({
            id: '_id',
            ...options
        });
    }
    getObjectId(id) {
        if (this.options.disableObjectify) {
            return id;
        }
        if (this.id === '_id' && mongodb_1.ObjectId.isValid(id)) {
            id = new mongodb_1.ObjectId(id.toString());
        }
        return id;
    }
    filterQuery(id, params) {
        const { $select, $sort, $limit, $skip, ...query } = (params.query || {});
        if (id !== null) {
            query.$and = (query.$and || []).concat({
                [this.id]: this.getObjectId(id)
            });
        }
        if (query[this.id]) {
            query[this.id] = this.getObjectId(query[this.id]);
        }
        return {
            filters: { $select, $sort, $limit, $skip },
            query
        };
    }
    getSelect(select) {
        if (Array.isArray(select)) {
            return select.reduce((value, name) => ({
                ...value,
                [name]: 1
            }), {});
        }
        return select;
    }
    async $findOrGet(id, params) {
        return id === null ? await this.$find(params) : await this.$get(id, params);
    }
    normalizeId(id, data) {
        if (this.id === '_id') {
            // Default Mongo IDs cannot be updated. The Mongo library handles
            // this automatically.
            return commons_1._.omit(data, this.id);
        }
        else if (id !== null) {
            // If not using the default Mongo _id field set the ID to its
            // previous value. This prevents orphaned documents.
            return {
                ...data,
                [this.id]: id
            };
        }
        return data;
    }
    async $get(id, params = {}) {
        const { Model } = this.getOptions(params);
        const { query, filters: { $select } } = this.filterQuery(id, params);
        const projection = $select
            ? {
                projection: {
                    ...this.getSelect($select),
                    [this.id]: 1
                }
            }
            : {};
        const findOptions = {
            ...params.mongodb,
            ...projection
        };
        return Promise.resolve(Model)
            .then((model) => model.findOne(query, findOptions))
            .then((data) => {
            if (data == null) {
                throw new errors_1.NotFound(`No record found for id '${id}'`);
            }
            return data;
        })
            .catch(error_handler_1.errorHandler);
    }
    async $find(params = {}) {
        const { filters, query } = this.filterQuery(null, params);
        const { paginate, Model, useEstimatedDocumentCount } = this.getOptions(params);
        const findOptions = { ...params.mongodb };
        const model = await Promise.resolve(Model);
        const q = model.find(query, findOptions);
        if (filters.$select !== undefined) {
            q.project(this.getSelect(filters.$select));
        }
        if (filters.$sort !== undefined) {
            q.sort(filters.$sort);
        }
        if (filters.$limit !== undefined) {
            q.limit(filters.$limit);
        }
        if (filters.$skip !== undefined) {
            q.skip(filters.$skip);
        }
        const runQuery = async (total) => ({
            total,
            limit: filters.$limit,
            skip: filters.$skip || 0,
            data: filters.$limit === 0 ? [] : (await q.toArray())
        });
        if (paginate && paginate.default) {
            if (useEstimatedDocumentCount && typeof model.estimatedDocumentCount === 'function') {
                return model.estimatedDocumentCount().then(runQuery);
            }
            return model.countDocuments(query, findOptions).then(runQuery);
        }
        return runQuery(0).then((page) => page.data);
    }
    async $create(data, params = {}) {
        const writeOptions = params.mongodb;
        const { Model } = this.getOptions(params);
        const model = await Promise.resolve(Model);
        const setId = (item) => {
            const entry = Object.assign({}, item);
            // Generate a MongoId if we use a custom id
            if (this.id !== '_id' && typeof entry[this.id] === 'undefined') {
                return {
                    [this.id]: new mongodb_1.ObjectId().toHexString(),
                    ...entry
                };
            }
            return entry;
        };
        const promise = Array.isArray(data)
            ? model
                .insertMany(data.map(setId), writeOptions)
                .then(async (result) => Promise.all(Object.values(result.insertedIds).map(async (_id) => model.findOne({ _id }, params.mongodb))))
            : model
                .insertOne(setId(data), writeOptions)
                .then(async (result) => model.findOne({ _id: result.insertedId }, params.mongodb));
        return promise.then((0, adapter_commons_1.select)(params, this.id)).catch(error_handler_1.errorHandler);
    }
    async $patch(id, _data, params = {}) {
        const data = this.normalizeId(id, _data);
        const { Model } = this.getOptions(params);
        const model = await Promise.resolve(Model);
        const { query, filters: { $select } } = this.filterQuery(id, params);
        const updateOptions = { ...params.mongodb };
        const modifier = Object.keys(data).reduce((current, key) => {
            const value = data[key];
            if (key.charAt(0) !== '$') {
                current.$set = {
                    ...current.$set,
                    [key]: value
                };
            }
            else {
                current[key] = value;
            }
            return current;
        }, {});
        const originalIds = await this.$findOrGet(id, {
            ...params,
            query: {
                ...query,
                $select: [this.id]
            },
            paginate: false
        });
        const items = Array.isArray(originalIds) ? originalIds : [originalIds];
        const idList = items.map((item) => item[this.id]);
        const findParams = {
            ...params,
            paginate: false,
            query: {
                [this.id]: { $in: idList },
                $select
            }
        };
        await model.updateMany(query, modifier, updateOptions);
        return this.$findOrGet(id, findParams).catch(error_handler_1.errorHandler);
    }
    async $update(id, data, params = {}) {
        const { Model } = this.getOptions(params);
        const model = await Promise.resolve(Model);
        const { query } = this.filterQuery(id, params);
        const replaceOptions = { ...params.mongodb };
        await model.replaceOne(query, this.normalizeId(id, data), replaceOptions);
        return this.$findOrGet(id, params).catch(error_handler_1.errorHandler);
    }
    async $remove(id, params = {}) {
        const { Model } = this.getOptions(params);
        const model = await Promise.resolve(Model);
        const { query, filters: { $select } } = this.filterQuery(id, params);
        const deleteOptions = { ...params.mongodb };
        const findParams = {
            ...params,
            paginate: false,
            query: {
                ...query,
                $select
            }
        };
        return this.$findOrGet(id, findParams)
            .then(async (items) => {
            await model.deleteMany(query, deleteOptions);
            return items;
        })
            .catch(error_handler_1.errorHandler);
    }
}
exports.MongoDbAdapter = MongoDbAdapter;
//# sourceMappingURL=adapter.js.map