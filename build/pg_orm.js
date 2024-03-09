"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require("reflect-metadata");
const orm_1 = require("./orm");
class PgORM extends orm_1.ORM {
    constructor() {
        super(...arguments);
        this.table_scripts = [];
    }
    register(constructors) {
        return __awaiter(this, void 0, void 0, function* () {
            PgORM.client = new pg_1.Client({
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
                        }
                        else {
                            acc += ` ${column_option.name} ${column_option.type},`;
                        }
                    }
                    else {
                        if (column_option.primary_key) {
                            acc += ` ${column_option.name} ${column_option.type} PRIMARY KEY`;
                        }
                        else {
                            acc += ` ${column_option.name} ${column_option.type}`;
                        }
                    }
                    return acc;
                }, '');
                return `CREATE TABLE IF NOT EXISTS ${info.table_name} (${column_scripts})`;
            });
            yield PgORM.client.connect();
            const promises = this.table_scripts.map((table_script) => __awaiter(this, void 0, void 0, function* () {
                yield PgORM.client.query(table_script);
            }));
            yield Promise.all(promises);
            this.entities = table_infos.reduce((acc, info) => {
                if (!acc[info.entity_name]) {
                    acc[info.entity_name] = {
                        find: (where) => __awaiter(this, void 0, void 0, function* () {
                            if (PgORM.client instanceof pg_1.Client) {
                                const { clause, values } = this.getWhereValues(where);
                                const result = yield PgORM.client.query(`SELECT ${info.column_names.join(', ')} FROM ${info.table_name} WHERE ${clause}`, values);
                                return result.rows;
                            }
                            return [];
                        }),
                        create: (data) => __awaiter(this, void 0, void 0, function* () {
                            const values = Object.values(data);
                            const indexes = Object.keys(values).map((value) => `$${parseInt(value) + 1}`);
                            yield PgORM.client.query(`INSERT INTO ${info.table_name} (${Object.keys(data).join(',')}) VALUES (${indexes.join(', ')})`, values);
                        }),
                        update: (where, data) => __awaiter(this, void 0, void 0, function* () {
                            const { clause, values } = this.getWhereValues(where);
                            const setters = Object.keys(data).map((key, index) => `"${key}"=$${index + values.length + 1}`).join(',');
                            const concat_values = values.concat(Object.values(data));
                            yield PgORM.client.query(`UPDATE ${info.table_name} SET ${setters} WHERE ${clause}`, concat_values);
                            return;
                        }),
                        delete: (where) => __awaiter(this, void 0, void 0, function* () {
                            const { clause, values } = this.getWhereValues(where);
                            yield PgORM.client.query(`DELETE FROM ${info.table_name} WHERE ${clause}`, values);
                            return true;
                        })
                    };
                }
                return acc;
            }, {});
        });
    }
    getWhereValues(where) {
        const where_obj = Object.entries(where).reduce((acc, [column, value], index) => {
            const key = `$${index + 1}`;
            if (!acc[key]) {
                acc[key] = {
                    column,
                    value,
                };
            }
            return acc;
        }, {});
        const keys = Object.keys(where_obj);
        const values = Object.values(where_obj).map(({ value }) => value);
        const clause = keys.reduce((acc, key, index) => {
            if (index < keys.length - 1) {
                acc += `${where_obj[key].column} = ${key} AND`;
            }
            else {
                acc += `${where_obj[key].column} = ${key}`;
            }
            return acc;
        }, '');
        return {
            clause,
            values,
        };
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (PgORM.client) {
                return this;
            }
            const pgORM = new PgORM();
            if (PgORM.client !== null && PgORM.client instanceof pg_1.Client) {
                try {
                    yield PgORM.client.connect();
                }
                catch (error) {
                    console.error(error);
                    throw error;
                }
            }
            return pgORM;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (PgORM.client !== null && PgORM.client instanceof pg_1.Client) {
                try {
                    yield PgORM.client.connect();
                }
                catch (error) {
                    console.error(error);
                    throw error;
                }
            }
        });
    }
}
PgORM.client = null;
exports.default = PgORM;
