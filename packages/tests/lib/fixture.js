"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.Service = void 0;
const assert_1 = __importDefault(require("assert"));
const clone = (data) => JSON.parse(JSON.stringify(data));
const findAllData = [
    {
        id: 0,
        description: 'You have to do something'
    },
    {
        id: 1,
        description: 'You have to do laundry'
    }
];
class Service {
    constructor() {
        this.events = ['log'];
    }
    async find() {
        return findAllData;
    }
    async get(name, params) {
        if (params.query.error) {
            throw new Error(`Something for ${name} went wrong`);
        }
        if (params.query.runtimeError) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            thingThatDoesNotExist(); // eslint-disable-line
        }
        return Promise.resolve({
            id: name,
            description: `You have to do ${name}!`
        });
    }
    async create(data) {
        const result = Object.assign({}, clone(data), {
            id: 42,
            status: 'created'
        });
        if (Array.isArray(data)) {
            result.many = true;
        }
        return result;
    }
    async update(id, data) {
        const result = Object.assign({}, clone(data), {
            id,
            status: 'updated'
        });
        if (id === null) {
            result.many = true;
        }
        return result;
    }
    async patch(id, data) {
        const result = Object.assign({}, clone(data), {
            id,
            status: 'patched'
        });
        if (id === null) {
            result.many = true;
        }
        return result;
    }
    async remove(id) {
        return { id };
    }
    async customMethod(data, params) {
        return {
            data,
            method: 'customMethod',
            provider: params.provider
        };
    }
    async internalMethod() {
        throw new Error('Should never get here');
    }
}
exports.Service = Service;
exports.verify = {
    find(data) {
        assert_1.default.deepStrictEqual(findAllData, clone(data), 'Data as expected');
    },
    get(id, data) {
        assert_1.default.strictEqual(data.id, id, 'Got id in data');
        assert_1.default.strictEqual(data.description, `You have to do ${id}!`, 'Got description');
    },
    create(original, current) {
        const expected = Object.assign({}, clone(original), {
            id: 42,
            status: 'created'
        });
        assert_1.default.deepStrictEqual(expected, clone(current), 'Data ran through .create as expected');
    },
    update(id, original, current) {
        const expected = Object.assign({}, clone(original), {
            id,
            status: 'updated'
        });
        assert_1.default.deepStrictEqual(expected, clone(current), 'Data ran through .update as expected');
    },
    patch(id, original, current) {
        const expected = Object.assign({}, clone(original), {
            id,
            status: 'patched'
        });
        assert_1.default.deepStrictEqual(expected, clone(current), 'Data ran through .patch as expected');
    },
    remove(id, data) {
        assert_1.default.deepStrictEqual({ id }, clone(data), '.remove called');
    }
};
//# sourceMappingURL=fixture.js.map