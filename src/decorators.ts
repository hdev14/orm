import 'reflect-metadata';
import { ColumnTypes } from './column_types';
import { COLUMN_SYMBOL, TABLE_SYMBOL } from "./symbols";

type ColumnOptions = {
  type: ColumnTypes;
  [key: string]: any;
}

export function Entity<T extends { new(...args: any[]): {} }>(constructor: T) {
  const tableName = `${constructor.name.toLocaleLowerCase()}s`;

  return class extends constructor {
    constructor(...args: any[]) {
      Reflect.defineMetadata(TABLE_SYMBOL, tableName, constructor.prototype);
      super(...args);
    }
  };
}

export function PrimaryKey(options?: ColumnOptions) {
  return Reflect.metadata(COLUMN_SYMBOL, {
    type: options && options.isUUID ? 'uuid' : 'integer',
    primaryKey: true
  });
}

export function Column(options?: ColumnOptions) {
  return Reflect.metadata(COLUMN_SYMBOL, options);
}