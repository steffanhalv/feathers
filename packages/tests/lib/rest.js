"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restTests = void 0;
const assert_1 = __importDefault(require("assert"));
const axios_1 = __importDefault(require("axios"));
const fixture_1 = require("./fixture");
function restTests(description, name, port) {
    describe(description, () => {
        it('GET .find', async () => {
            const res = await axios_1.default.get(`http://localhost:${port}/${name}`);
            assert_1.default.ok(res.status === 200, 'Got OK status code');
            fixture_1.verify.find(res.data);
        });
        it('GET .get', async () => {
            const res = await axios_1.default.get(`http://localhost:${port}/${name}/dishes`);
            assert_1.default.ok(res.status === 200, 'Got OK status code');
            fixture_1.verify.get('dishes', res.data);
        });
        it('POST .create', async () => {
            const original = {
                description: 'POST .create'
            };
            const res = await axios_1.default.post(`http://localhost:${port}/${name}`, original);
            assert_1.default.ok(res.status === 201, 'Got CREATED status code');
            fixture_1.verify.create(original, res.data);
        });
        it('PUT .update', async () => {
            const original = {
                description: 'PUT .update'
            };
            const res = await axios_1.default.put(`http://localhost:${port}/${name}/544`, original);
            assert_1.default.ok(res.status === 200, 'Got OK status code');
            fixture_1.verify.update('544', original, res.data);
        });
        it('PUT .update many', async () => {
            const original = {
                description: 'PUT .update',
                many: true
            };
            const res = await axios_1.default.put(`http://localhost:${port}/${name}`, original);
            const { data } = res;
            assert_1.default.ok(res.status === 200, 'Got OK status code');
            fixture_1.verify.update(null, original, data);
        });
        it('PATCH .patch', async () => {
            const original = {
                description: 'PATCH .patch'
            };
            const res = await axios_1.default.patch(`http://localhost:${port}/${name}/544`, original);
            assert_1.default.ok(res.status === 200, 'Got OK status code');
            fixture_1.verify.patch('544', original, res.data);
        });
        it('PATCH .patch many', async () => {
            const original = {
                description: 'PATCH .patch',
                many: true
            };
            const res = await axios_1.default.patch(`http://localhost:${port}/${name}`, original);
            assert_1.default.ok(res.status === 200, 'Got OK status code');
            fixture_1.verify.patch(null, original, res.data);
        });
        it('DELETE .remove', async () => {
            const res = await axios_1.default.delete(`http://localhost:${port}/${name}/233`);
            assert_1.default.ok(res.status === 200, 'Got OK status code');
            fixture_1.verify.remove('233', res.data);
        });
        it('DELETE .remove many', async () => {
            const res = await axios_1.default.delete(`http://localhost:${port}/${name}`);
            assert_1.default.ok(res.status === 200, 'Got OK status code');
            fixture_1.verify.remove(null, res.data);
        });
    });
}
exports.restTests = restTests;
//# sourceMappingURL=rest.js.map