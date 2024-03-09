import 'reflect-metadata';
import { ColumnTypes } from './column_types';
import { COLUMN_SYMBOL, TABLE_SYMBOL } from "./symbols";

type ColumnOptions = {
  type: ColumnTypes;
  [key: string]: any;
}

export function Entity<T extends { new(...args: any[]): {} }>(constructor: T) {
  const tableName = `${constructor.name.toLocaleLowerCase()}s`;
  Reflect.defineMetadata(TABLE_SYMBOL, tableName, constructor.prototype);
}

export function PrimaryKey(options?: ColumnOptions) {
  return Reflect.metadata(COLUMN_SYMBOL, {
    type: options && options.isUUID ? 'uuid' : 'integer',
    primary_key: true
  });
}

export function Column(options?: ColumnOptions) {
  return Reflect.metadata(COLUMN_SYMBOL, options);
}