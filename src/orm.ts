import { getColumn, getTableName } from "./utils";

export type Where = {
  id?: string | number;
  [key: string]: any;
};

export interface DBMethods {
  find<T>(where: Where): Promise<T[]>;
  create(data: Record<string, any>): Promise<void>;
  update(where: Where, data: Record<string, any>): Promise<void>;
  delete(where: Where): Promise<boolean>;
}

export abstract class ORM {
  entities: Record<string, DBMethods> = {};

  abstract register(constructors: any[]): Promise<void>;

  abstract connect(): Promise<ORM>;

  abstract disconnect(): Promise<void>;

  protected getTableInfos(constructors: any[]) {
    return constructors.map((ctor) => {
      const entity_name = ctor.name.toLocaleLowerCase();
      const instance = new ctor();
      const table_name = getTableName(instance);
      const column_names = Object.keys(instance);
      const column_options = Object.keys(instance).map((key) => getColumn(instance, key));

      return {
        entity_name,
        table_name,
        column_names,
        column_options,
      }
    });
  }
}

