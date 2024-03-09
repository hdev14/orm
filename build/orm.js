"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORM = void 0;
const utils_1 = require("./utils");
class ORM {
    constructor() {
        this.entities = {};
    }
    getTableInfos(constructors) {
        return constructors.map((ctor) => {
            const entity_name = ctor.name.toLocaleLowerCase();
            const instance = new ctor();
            const table_name = (0, utils_1.getTableName)(instance);
            const column_names = Object.keys(instance);
            const column_options = Object.keys(instance).map((key) => (0, utils_1.getColumn)(instance, key));
            return {
                entity_name,
                table_name,
                column_names,
                column_options,
            };
        });
    }
}
exports.ORM = ORM;
