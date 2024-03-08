import 'reflect-metadata';
import { COLUMN_SYMBOL, TABLE_SYMBOL } from "./symbols";

export function getTableName(target: any) {
  return Reflect.getMetadata(TABLE_SYMBOL, target);
}

export function getColumn(target: any, propertyKey: string) {
  return Reflect.getMetadata(COLUMN_SYMBOL, target, propertyKey);
}