"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
exports.default = (test, app, _errors, serviceName, idProp) => {
    describe('Query Syntax', () => {
        let bob;
        let alice;
        let doug;
        let service;
        beforeEach(async () => {
            service = app.service(serviceName);
            bob = await app.service(serviceName).create({
                name: 'Bob',
                age: 25
            });
            doug = await app.service(serviceName).create({
                name: 'Doug',
                age: 32
            });
            alice = await app.service(serviceName).create({
                name: 'Alice',
                age: 19
            });
        });
        afterEach(async () => {
            await service.remove(bob[idProp]);
            await service.remove(alice[idProp]);
            await service.remove(doug[idProp]);
        });
        test('.find + equal', async () => {
            const params = { query: { name: 'Alice' } };
            const data = await service.find(params);
            assert_1.default.ok(Array.isArray(data));
            assert_1.default.strictEqual(data.length, 1);
            assert_1.default.strictEqual(data[0].name, 'Alice');
        });
        test('.find + equal multiple', async () => {
            const data = await service.find({
                query: { name: 'Alice', age: 20 }
            });
            assert_1.default.strictEqual(data.length, 0);
        });
        describe('special filters', () => {
            test('.find + $sort', async () => {
                let data = await service.find({
                    query: {
                        $sort: { name: 1 }
                    }
                });
                assert_1.default.strictEqual(data.length, 3);
                assert_1.default.strictEqual(data[0].name, 'Alice');
                assert_1.default.strictEqual(data[1].name, 'Bob');
                assert_1.default.strictEqual(data[2].name, 'Doug');
                data = await service.find({
                    query: {
                        $sort: { name: -1 }
                    }
                });
                assert_1.default.strictEqual(data.length, 3);
                assert_1.default.strictEqual(data[0].name, 'Doug');
                assert_1.default.strictEqual(data[1].name, 'Bob');
                assert_1.default.strictEqual(data[2].name, 'Alice');
            });
            test('.find + $sort + string', async () => {
                const data = await service.find({
                    query: {
                        $sort: { name: '1' }
                    }
                });
                assert_1.default.strictEqual(data.length, 3);
                assert_1.default.strictEqual(data[0].name, 'Alice');
                assert_1.default.strictEqual(data[1].name, 'Bob');
                assert_1.default.strictEqual(data[2].name, 'Doug');
            });
            test('.find + $limit', async () => {
                const data = await service.find({
                    query: {
                        $limit: 2
                    }
                });
                assert_1.default.strictEqual(data.length, 2);
            });
            test('.find + $limit 0', async () => {
                const data = await service.find({
                    query: {
                        $limit: 0
                    }
                });
                assert_1.default.strictEqual(data.length, 0);
            });
            test('.find + $skip', async () => {
                const data = await service.find({
                    query: {
                        $sort: { name: 1 },
                        $skip: 1
                    }
                });
                assert_1.default.strictEqual(data.length, 2);
                assert_1.default.strictEqual(data[0].name, 'Bob');
                assert_1.default.strictEqual(data[1].name, 'Doug');
            });
            test('.find + $select', async () => {
                const data = await service.find({
                    query: {
                        name: 'Alice',
                        $select: ['name']
                    }
                });
                assert_1.default.strictEqual(data.length, 1);
                assert_1.default.strictEqual(data[0].name, 'Alice');
                assert_1.default.strictEqual(data[0].age, undefined);
            });
            test('.find + $or', async () => {
                const data = await service.find({
                    query: {
                        $or: [{ name: 'Alice' }, { name: 'Bob' }],
                        $sort: { name: 1 }
                    }
                });
                assert_1.default.strictEqual(data.length, 2);
                assert_1.default.strictEqual(data[0].name, 'Alice');
                assert_1.default.strictEqual(data[1].name, 'Bob');
            });
            test('.find + $in', async () => {
                const data = await service.find({
                    query: {
                        name: {
                            $in: ['Alice', 'Bob']
                        },
                        $sort: { name: 1 }
                    }
                });
                assert_1.default.strictEqual(data.length, 2);
                assert_1.default.strictEqual(data[0].name, 'Alice');
                assert_1.default.strictEqual(data[1].name, 'Bob');
            });
            test('.find + $nin', async () => {
                const data = await service.find({
                    query: {
                        name: {
                            $nin: ['Alice', 'Bob']
                        }
                    }
                });
                assert_1.default.strictEqual(data.length, 1);
                assert_1.default.strictEqual(data[0].name, 'Doug');
            });
            test('.find + $lt', async () => {
                const data = await service.find({
                    query: {
                        age: {
                            $lt: 30
                        }
                    }
                });
                assert_1.default.strictEqual(data.length, 2);
            });
            test('.find + $lte', async () => {
                const data = await service.find({
                    query: {
                        age: {
                            $lte: 25
                        }
                    }
                });
                assert_1.default.strictEqual(data.length, 2);
            });
            test('.find + $gt', async () => {
                const data = await service.find({
                    query: {
                        age: {
                            $gt: 30
                        }
                    }
                });
                assert_1.default.strictEqual(data.length, 1);
            });
            test('.find + $gte', async () => {
                const data = await service.find({
                    query: {
                        age: {
                            $gte: 25
                        }
                    }
                });
                assert_1.default.strictEqual(data.length, 2);
            });
            test('.find + $ne', async () => {
                const data = await service.find({
                    query: {
                        age: {
                            $ne: 25
                        }
                    }
                });
                assert_1.default.strictEqual(data.length, 2);
            });
        });
        test('.find + $gt + $lt + $sort', async () => {
            const params = {
                query: {
                    age: {
                        $gt: 18,
                        $lt: 30
                    },
                    $sort: { name: 1 }
                }
            };
            const data = await service.find(params);
            assert_1.default.strictEqual(data.length, 2);
            assert_1.default.strictEqual(data[0].name, 'Alice');
            assert_1.default.strictEqual(data[1].name, 'Bob');
        });
        test('.find + $or nested + $sort', async () => {
            const params = {
                query: {
                    $or: [
                        { name: 'Doug' },
                        {
                            age: {
                                $gte: 18,
                                $lt: 25
                            }
                        }
                    ],
                    $sort: { name: 1 }
                }
            };
            const data = await service.find(params);
            assert_1.default.strictEqual(data.length, 2);
            assert_1.default.strictEqual(data[0].name, 'Alice');
            assert_1.default.strictEqual(data[1].name, 'Doug');
        });
        describe('params.adapter', () => {
            test('params.adapter + paginate', async () => {
                const page = await service.find({
                    adapter: {
                        paginate: { default: 3 }
                    }
                });
                assert_1.default.strictEqual(page.limit, 3);
                assert_1.default.strictEqual(page.skip, 0);
            });
            test('params.adapter + multi', async () => {
                const items = [
                    {
                        name: 'Garald',
                        age: 200
                    },
                    {
                        name: 'Harald',
                        age: 24
                    }
                ];
                const multiParams = {
                    adapter: {
                        multi: ['create']
                    }
                };
                const users = await service.create(items, multiParams);
                assert_1.default.strictEqual(users.length, 2);
                await service.remove(users[0][idProp]);
                await service.remove(users[1][idProp]);
                await assert_1.default.rejects(() => service.patch(null, { age: 2 }, multiParams), {
                    message: 'Can not patch multiple entries'
                });
            });
        });
        describe('paginate', function () {
            beforeEach(() => {
                service.options.paginate = {
                    default: 1,
                    max: 2
                };
            });
            afterEach(() => {
                service.options.paginate = {};
            });
            test('.find + paginate', async () => {
                const page = await service.find({
                    query: { $sort: { name: -1 } }
                });
                assert_1.default.strictEqual(page.total, 3);
                assert_1.default.strictEqual(page.limit, 1);
                assert_1.default.strictEqual(page.skip, 0);
                assert_1.default.strictEqual(page.data[0].name, 'Doug');
            });
            test('.find + paginate + query', async () => {
                const page = await service.find({
                    query: {
                        $sort: { name: -1 },
                        name: 'Doug'
                    }
                });
                assert_1.default.strictEqual(page.total, 1);
                assert_1.default.strictEqual(page.limit, 1);
                assert_1.default.strictEqual(page.skip, 0);
                assert_1.default.strictEqual(page.data[0].name, 'Doug');
            });
            test('.find + paginate + $limit + $skip', async () => {
                const params = {
                    query: {
                        $skip: 1,
                        $limit: 4,
                        $sort: { name: -1 }
                    }
                };
                const page = await service.find(params);
                assert_1.default.strictEqual(page.total, 3);
                assert_1.default.strictEqual(page.limit, 2);
                assert_1.default.strictEqual(page.skip, 1);
                assert_1.default.strictEqual(page.data[0].name, 'Bob');
                assert_1.default.strictEqual(page.data[1].name, 'Alice');
            });
            test('.find + paginate + $limit 0', async () => {
                const page = await service.find({
                    query: { $limit: 0 }
                });
                assert_1.default.strictEqual(page.total, 3);
                assert_1.default.strictEqual(page.data.length, 0);
            });
            test('.find + paginate + params', async () => {
                const page = await service.find({ paginate: { default: 3 } });
                assert_1.default.strictEqual(page.limit, 3);
                assert_1.default.strictEqual(page.skip, 0);
                const results = await service.find({ paginate: false });
                assert_1.default.ok(Array.isArray(results));
                assert_1.default.strictEqual(results.length, 3);
            });
        });
    });
};
//# sourceMappingURL=syntax.js.map