"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumn = exports.getTableName = void 0;
require("reflect-metadata");
const symbols_1 = require("./symbols");
function getTableName(target) {
    return Reflect.getMetadata(symbols_1.TABLE_SYMBOL, target);
}
exports.getTableName = getTableName;
function getColumn(target, propertyKey) {
    return Reflect.getMetadata(symbols_1.COLUMN_SYMBOL, target, propertyKey);
}
exports.getColumn = getColumn;
