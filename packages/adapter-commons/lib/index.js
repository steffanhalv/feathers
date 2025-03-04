"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.select = exports.OPERATORS = exports.FILTERS = exports.filterQuery = void 0;
const commons_1 = require("@feathersjs/commons");
__exportStar(require("./declarations"), exports);
__exportStar(require("./service"), exports);
var query_1 = require("./query");
Object.defineProperty(exports, "filterQuery", { enumerable: true, get: function () { return query_1.filterQuery; } });
Object.defineProperty(exports, "FILTERS", { enumerable: true, get: function () { return query_1.FILTERS; } });
Object.defineProperty(exports, "OPERATORS", { enumerable: true, get: function () { return query_1.OPERATORS; } });
__exportStar(require("./sort"), exports);
// Return a function that filters a result object or array
// and picks only the fields passed as `params.query.$select`
// and additional `otherFields`
function select(params, ...otherFields) {
    var _a;
    const queryFields = (_a = params === null || params === void 0 ? void 0 : params.query) === null || _a === void 0 ? void 0 : _a.$select;
    if (!queryFields) {
        return (result) => result;
    }
    const resultFields = queryFields.concat(otherFields);
    const convert = (result) => commons_1._.pick(result, ...resultFields);
    return (result) => {
        if (Array.isArray(result)) {
            return result.map(convert);
        }
        return convert(result);
    };
}
exports.select = select;
//# sourceMappingURL=index.js.map