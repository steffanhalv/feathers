"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientTests = void 0;
const assert_1 = require("assert");
function clientTests(app, name) {
    const getService = () => (name && typeof app.service === 'function' ? app.service(name) : app);
    describe('Service base tests', () => {
        it('.find', async () => {
            const todos = await getService().find();
            assert_1.strict.deepEqual(todos, [
                {
                    // eslint-disable-line
                    text: 'some todo',
                    complete: false,
                    id: 0
                }
            ]);
        });
        it('.get and params passing', async () => {
            const query = {
                some: 'thing',
                other: ['one', 'two'],
                nested: { a: { b: 'object' } }
            };
            const todo = await getService().get(0, { query });
            assert_1.strict.deepEqual(todo, {
                // eslint-disable-line
                id: 0,
                text: 'some todo',
                complete: false,
                query
            });
        });
        it('.create', async () => {
            const todo = await getService().create({
                text: 'created todo',
                complete: true
            });
            assert_1.strict.deepEqual(todo, {
                // eslint-disable-line
                id: 1,
                text: 'created todo',
                complete: true
            });
        });
        it('.create and created event', (done) => {
            getService().once('created', (data) => {
                assert_1.strict.strictEqual(data.text, 'created todo');
                assert_1.strict.ok(data.complete);
                done();
            });
            getService().create({ text: 'created todo', complete: true });
        });
        it('.update and updated event', (done) => {
            getService().once('updated', (data) => {
                assert_1.strict.strictEqual(data.text, 'updated todo');
                assert_1.strict.ok(data.complete);
                done();
            });
            getService()
                .create({ text: 'todo to update', complete: false })
                .then((todo) => {
                getService().update(todo.id, {
                    text: 'updated todo',
                    complete: true
                });
            });
        });
        it('.patch and patched event', (done) => {
            getService().once('patched', (data) => {
                assert_1.strict.strictEqual(data.text, 'todo to patch');
                assert_1.strict.ok(data.complete);
                done();
            });
            getService()
                .create({ text: 'todo to patch', complete: false })
                .then((todo) => getService().patch(todo.id, { complete: true }));
        });
        it('.remove and removed event', (done) => {
            getService().once('removed', (data) => {
                assert_1.strict.strictEqual(data.text, 'todo to remove');
                assert_1.strict.strictEqual(data.complete, false);
                done();
            });
            getService()
                .create({ text: 'todo to remove', complete: false })
                .then((todo) => getService().remove(todo.id))
                .catch(done);
        });
        it('.get with error', async () => {
            const query = { error: true };
            try {
                await getService().get(0, { query });
                assert_1.strict.fail('Should never get here');
            }
            catch (error) {
                assert_1.strict.strictEqual(error.message, 'Something went wrong');
            }
        });
    });
}
exports.clientTests = clientTests;
//# sourceMappingURL=client.js.map