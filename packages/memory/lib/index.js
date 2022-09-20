"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memory = exports.MemoryService = exports.MemoryAdapter = void 0;
const errors_1 = require("@feathersjs/errors");
const commons_1 = require("@feathersjs/commons");
const adapter_commons_1 = require("@feathersjs/adapter-commons");
const sift_1 = __importDefault(require("sift"));
const _select = (data, params, ...args) => {
    const base = (0, adapter_commons_1.select)(params, ...args);
    return base(JSON.parse(JSON.stringify(data)));
};
class MemoryAdapter extends adapter_commons_1.AdapterBase {
    constructor(options = {}) {
        super({
            id: 'id',
            matcher: sift_1.default,
            sorter: adapter_commons_1.sorter,
            store: {},
            startId: 0,
            ...options
        });
        this._uId = this.options.startId;
        this.store = { ...this.options.store };
    }
    async getEntries(_params) {
        const params = _params || {};
        return this.$find({
            ...params,
            paginate: false
        });
    }
    getQuery(params) {
        const { $skip, $sort, $limit, $select, ...query } = params.query || {};
        return {
            query,
            filters: { $skip, $sort, $limit, $select }
        };
    }
    async $find(params = {}) {
        const { paginate } = this.getOptions(params);
        const { query, filters } = this.getQuery(params);
        let values = commons_1._.values(this.store).filter(this.options.matcher(query));
        const total = values.length;
        if (filters.$sort !== undefined) {
            values.sort(this.options.sorter(filters.$sort));
        }
        if (filters.$skip !== undefined) {
            values = values.slice(filters.$skip);
        }
        if (filters.$limit !== undefined) {
            values = values.slice(0, filters.$limit);
        }
        const result = {
            total,
            limit: filters.$limit,
            skip: filters.$skip || 0,
            data: values.map((value) => _select(value, params))
        };
        if (!paginate) {
            return result.data;
        }
        return result;
    }
    async $get(id, params = {}) {
        const { query } = this.getQuery(params);
        if (id in this.store) {
            const value = this.store[id];
            if (this.options.matcher(query)(value)) {
                return _select(value, params, this.id);
            }
        }
        throw new errors_1.NotFound(`No record found for id '${id}'`);
    }
    async $create(data, params = {}) {
        if (Array.isArray(data)) {
            return Promise.all(data.map((current) => this.$create(current, params)));
        }
        const id = data[this.id] || this._uId++;
        const current = commons_1._.extend({}, data, { [this.id]: id });
        const result = (this.store[id] = current);
        return _select(result, params, this.id);
    }
    async $update(id, data, params = {}) {
        const oldEntry = await this.$get(id);
        // We don't want our id to change type if it can be coerced
        const oldId = oldEntry[this.id];
        // eslint-disable-next-line eqeqeq
        id = oldId == id ? oldId : id;
        this.store[id] = commons_1._.extend({}, data, { [this.id]: id });
        return this.$get(id, params);
    }
    async $patch(id, data, params = {}) {
        const { query } = this.getQuery(params);
        const patchEntry = (entry) => {
            const currentId = entry[this.id];
            this.store[currentId] = commons_1._.extend(this.store[currentId], commons_1._.omit(data, this.id));
            return _select(this.store[currentId], params, this.id);
        };
        if (id === null) {
            const entries = await this.getEntries({
                ...params,
                query
            });
            return entries.map(patchEntry);
        }
        return patchEntry(await this.$get(id, params)); // Will throw an error if not found
    }
    async $remove(id, params = {}) {
        const { query } = this.getQuery(params);
        if (id === null) {
            const entries = await this.getEntries({
                ...params,
                query
            });
            return Promise.all(entries.map((current) => this.$remove(current[this.id], params)));
        }
        const entry = await this.$get(id, params);
        delete this.store[id];
        return entry;
    }
}
exports.MemoryAdapter = MemoryAdapter;
class MemoryService extends MemoryAdapter {
    async find(params) {
        return this._find(params);
    }
    async get(id, params) {
        return this._get(id, params);
    }
    async create(data, params) {
        return this._create(data, params);
    }
    async update(id, data, params) {
        return this._update(id, data, params);
    }
    async patch(id, data, params) {
        return this._patch(id, data, params);
    }
    async remove(id, params) {
        return this._remove(id, params);
    }
}
exports.MemoryService = MemoryService;
function memory(options = {}) {
    return new MemoryService(options);
}
exports.memory = memory;
//# sourceMappingURL=index.js.map