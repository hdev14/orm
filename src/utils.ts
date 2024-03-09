import 'reflect-metadata';
import { ColumnTypes } from './column_types';
import { COLUMN_SYMBOL, TABLE_SYMBOL } from "./symbols";

export function getTableName(target: any) {
  return Reflect.getMetadata(TABLE_SYMBOL, target);
}

export function getColumn(target: any, propertyKey: string): { name: string, type: ColumnTypes, primary_key?: boolean } {
  return Object.assign({ name: propertyKey }, Reflect.getMetadata(COLUMN_SYMBOL, target, propertyKey));
}