import { Client } from 'pg';
import 'reflect-metadata';
import { DBMethods, ORM, Where } from "./orm";
import { getColumn, getTableName } from './utils';

export default class PgORM extends ORM {
  private static client: Client | any = null;
  public table_scripts: string[] = [];

  async register(constructors: any[]): Promise<void> {
    PgORM.client = new Client({
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'admin',
      password: 'admin',
    });

    const table_infos = constructors.map((ctor) => {
      const entity_name = ctor.name.toLocaleLowerCase();
      const instance = new ctor();
      const table_name = getTableName(instance);
      const column_names = Object.keys(instance);
      const column_options = Object.keys(instance).map((key) => {
        return getColumn(instance, key);
      });

      return {
        entity_name,
        instance,
        table_name,
        column_names,
        column_options,
      }
    });

    this.table_scripts = table_infos.map((info) => {
      console.log(info.column_options);
      const column_scripts = info.column_options.reduce((acc, column_option, index) => {
        if (index < info.column_options.length - 1) {
          if (column_option.primary_key) {
            acc += ` ${column_option.name} ${column_option.type} PRIMARY KEY,`;
          } else {
            acc += ` ${column_option.name} ${column_option.type},`;
          }
        } else {
          if (column_option.primary_key) {
            acc += ` ${column_option.name} ${column_option.type} PRIMARY KEY`;
          } else {
            acc += ` ${column_option.name} ${column_option.type}`;
          }
        }

        return acc;
      }, '');

      return `CREATE TABLE IF NOT EXISTS ${info.table_name} (${column_scripts})`;
    });

    console.log(this.table_scripts);

    await PgORM.client.connect();

    const promises = this.table_scripts.map(async (table_script) => {
      await PgORM.client.query(table_script);
    });

    await Promise.all(promises);

    this.entities = table_infos.reduce((acc, info) => {
      if (!acc[info.entity_name]) {
        acc[info.entity_name] = {
          find: async (where: Where) => {
            if (PgORM.client instanceof Client) {
              const where_obj = Object.entries(where).reduce((acc, [column, value], index) => {
                const key = `$${index + 1}`;

                if (!acc[key]) {
                  acc[key] = {
                    column,
                    value,
                  };
                }

                return acc;
              }, {} as Record<string, { column: string, value: any }>);

              const where_keys = Object.keys(where_obj);
              const where_values = Object.values(where_obj);

              const where_clause = where_keys.reduce((acc, key, index) => {
                if (index < where_keys.length - 1) {
                  acc += `${where_obj[key].column} = ${key} AND`
                } else {
                  acc += `${where_obj[key].column} = ${key}`;
                }

                return acc;
              }, '');

              const where_fields = where_values.map(({ value }) => value);

              const result = await PgORM.client.query(
                `SELECT ${info.column_names.join(', ')} FROM ${info.table_name} WHERE ${where_clause}`,
                where_fields
              );

              return result.rows;
            }

            return [];
          },
          create: async (data: Record<string, any>) => {
            console.log('test');
          },
          update: async (where: Where, data: Record<string, any>) => {
            console.log('test');
          },
          delete: async (where: Where) => {
            console.log('test');
            return true;
          }
        }
      }

      return acc
    }, {} as Record<string, DBMethods>);
  }

  async connect(): Promise<ORM> {
    if (PgORM.client) {
      return this;
    }

    const pgORM = new PgORM();

    if (PgORM.client !== null && PgORM.client instanceof Client) {
      try {
        await PgORM.client.connect();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    return pgORM;
  }

  async disconnect(): Promise<void> {
    if (PgORM.client !== null && PgORM.client instanceof Client) {
      try {
        await PgORM.client.connect();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
}
