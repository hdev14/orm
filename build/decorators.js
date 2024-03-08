"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = exports.PrimaryKey = exports.Entity = void 0;
require("reflect-metadata");
const symbols_1 = require("./symbols");
function Entity(constructor) {
    const tableName = `${constructor.name.toLocaleLowerCase()}s`;
    return class extends constructor {
        constructor(...args) {
            Reflect.defineMetadata(symbols_1.TABLE_SYMBOL, tableName, constructor.prototype);
            super(...args);
        }
    };
}
exports.Entity = Entity;
function PrimaryKey(options) {
    return Reflect.metadata(symbols_1.COLUMN_SYMBOL, {
        type: options && options.isUUID ? 'uuid' : 'integer',
        primaryKey: true
    });
}
exports.PrimaryKey = PrimaryKey;
function Column(options) {
    return Reflect.metadata(symbols_1.COLUMN_SYMBOL, options);
}
exports.Column = Column;
