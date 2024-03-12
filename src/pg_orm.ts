import { Client } from 'pg';
import 'reflect-metadata';
import { DBMethods, DbConfig, EntityInfo, ORM, ORMOptions, Where } from "./orm";

export default class PgORM extends ORM {
  private static client: Client | any = null;
  public table_scripts: string[] = [];

  async configure(options: ORMOptions): Promise<void> {
    const entity_infos = this.getEntityInfos(options.entities);

    await this.createTables(options.db_config, entity_infos);

    this.generateEntitiesMethods(entity_infos);
  }

  private generateEntitiesMethods(entity_infos: EntityInfo[]) {
    this.entities = entity_infos.reduce((acc, info) => {
      if (!acc[info.entity_name]) {
        acc[info.entity_name] = {
          find: this.makeFindMethod(info.column_names, info.table_name),
          create: this.makeCreateMethod(info.table_name),
          update: this.makeUpdateMethod(info.table_name),
          delete: this.makeDeleteMethod(info.table_name)
        };
      }

      return acc;
    }, {} as Record<string, DBMethods>);
  }

  private makeDeleteMethod(table_name: string): (where: Where) => Promise<boolean> {
    return async (where: Where) => {
      const { clause, values } = this.getWhereValues(where);
      await PgORM.client.query(`DELETE FROM ${table_name} WHERE ${clause}`, values);
      return true;
    };
  }

  private makeUpdateMethod(table_name: string): (where: Where, data: Record<string, any>) => Promise<void> {
    return async (where: Where, data: Record<string, any>) => {
      const { clause, values } = this.getWhereValues(where);
      const setters = Object.keys(data).map((key, index) => `"${key}"=$${index + values.length + 1}`).join(',');
      const concat_values = values.concat(Object.values(data));
      await PgORM.client.query(`UPDATE ${table_name} SET ${setters} WHERE ${clause}`, concat_values);
      return;
    }
  }

  private makeCreateMethod(table_name: string): (data: Record<string, any>) => Promise<void> {
    return async (data: Record<string, any>) => {
      const values = Object.values(data);
      const indexes = Object.keys(values).map((value) => `$${parseInt(value) + 1}`);

      await PgORM.client.query(
        `INSERT INTO ${table_name} (${Object.keys(data).join(',')}) VALUES (${indexes.join(', ')})`,
        values
      );
    }
  }

  private makeFindMethod<T>(column_names: string[], table_name: string): <T>(where: Where) => Promise<T[]> {
    return async (where: Where) => {
      if (PgORM.client instanceof Client) {
        const { clause, values } = this.getWhereValues(where);

        const result = await PgORM.client.query(
          `SELECT ${column_names.join(', ')} FROM ${table_name} WHERE ${clause}`,
          values
        );

        return result.rows;
      }

      return [];
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

  private async createTables(db_config: DbConfig, entity_infos: EntityInfo[]) {
    PgORM.client = new Client(db_config);

    await PgORM.client.connect();

    this.table_scripts = entity_infos.map((info) => {
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

    const promises = this.table_scripts.map(async (table_script) => {
      await PgORM.client.query(table_script);
    });

    await Promise.all(promises);
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
}
