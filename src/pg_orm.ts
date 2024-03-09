import { Client } from 'pg';
import 'reflect-metadata';
import { DBMethods, ORM, Where } from "./orm";

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

    const table_infos = this.getTableInfos(constructors);

    this.table_scripts = table_infos.map((info) => {
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
              const { clause, values } = this.getWhereValues(where);


              const result = await PgORM.client.query(
                `SELECT ${info.column_names.join(', ')} FROM ${info.table_name} WHERE ${clause}`,
                values,
              );

              return result.rows;
            }

            return [];
          },
          create: async (data: Record<string, any>) => {
            const values = Object.values(data);
            const indexes = Object.keys(values).map((value) => `$${parseInt(value) + 1}`);

            await PgORM.client.query(
              `INSERT INTO ${info.table_name} (${Object.keys(data).join(',')}) VALUES (${indexes.join(', ')})`,
              values,
            );
          },
          update: async (where: Where, data: Record<string, any>) => {
            const { clause, values } = this.getWhereValues(where);
            const setters = Object.keys(data).map((key, index) => `"${key}"=$${index + values.length + 1}`).join(',');
            const concat_values = values.concat(Object.values(data));
            await PgORM.client.query(`UPDATE ${info.table_name} SET ${setters} WHERE ${clause}`, concat_values);
            return;
          },
          delete: async (where: Where) => {
            const { clause, values } = this.getWhereValues(where);
            await PgORM.client.query(`DELETE FROM ${info.table_name} WHERE ${clause}`, values);
            return true;
          }
        }
      }

      return acc
    }, {} as Record<string, DBMethods>);
  }

  private getWhereValues(where: Where) {
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

    const keys = Object.keys(where_obj);
    const values = Object.values(where_obj).map(({ value }) => value);

    const clause = keys.reduce((acc, key, index) => {
      if (index < keys.length - 1) {
        acc += `${where_obj[key].column} = ${key} AND`;
      } else {
        acc += `${where_obj[key].column} = ${key}`;
      }

      return acc;
    }, '');

    return {
      clause,
      values,
    }
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
