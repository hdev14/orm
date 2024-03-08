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
exports.ORM = void 0;
class ORM {
    constructor(entity_names) {
        this.entities = entity_names.reduce((acc, entity_name) => {
            if (!acc[entity_name]) {
                acc[entity_name] = {
                    find: (where) => __awaiter(this, void 0, void 0, function* () {
                        console.log('test');
                        return {};
                    }),
                    create: (data) => __awaiter(this, void 0, void 0, function* () {
                        console.log('test');
                    }),
                    update: (where, data) => __awaiter(this, void 0, void 0, function* () {
                        console.log('test');
                    }),
                    delete: (where) => __awaiter(this, void 0, void 0, function* () {
                        console.log('test');
                        return true;
                    })
                };
            }
            return acc;
        }, {});
    }
    static register(constructors) {
        const entity_names = constructors.map((ctor) => ctor.name);
        ORM.instance = new ORM(entity_names);
    }
    static connect() {
        return Promise.resolve(ORM.instance);
    }
    disconnect() {
        throw new Error('not implemented');
    }
}
exports.ORM = ORM;
