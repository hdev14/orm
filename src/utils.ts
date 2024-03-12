import 'reflect-metadata';
import { ColumnTypes } from './column_types';
import { COLUMN_SYMBOL, TABLE_SYMBOL } from "./symbols";

export function getTableName(target: any) {
  return Reflect.getMetadata(TABLE_SYMBOL, target);
}

export type ColumnOptions = {
  name: string;
  type: ColumnTypes;
  primary_key?: boolean;
};

export function getColumn(target: any, property_key: string): ColumnOptions {
  return Object.assign({ name: property_key }, Reflect.getMetadata(COLUMN_SYMBOL, target, property_key));
}