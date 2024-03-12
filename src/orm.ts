import { ColumnOptions, getColumn, getTableName } from "./utils";

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

export type DbConfig = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

export type ORMOptions = {
  db_config: DbConfig;
  migrate?: boolean;
  entities: any[];
};

export type EntityInfo = {
  entity_name: string;
  table_name: string;
  column_names: string[];
  column_options: ColumnOptions[];
};

export abstract class ORM {
  entities: Record<string, DBMethods> = {};

  abstract configure(options: ORMOptions): Promise<void>;

  abstract connect(): Promise<ORM>;

  abstract disconnect(): Promise<void>;

  protected getEntityInfos(entities: any[]): EntityInfo[] {
    return entities.map((ctor) => {
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

