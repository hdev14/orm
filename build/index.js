"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const decorators_1 = require("./decorators");
const orm_1 = require("./orm");
let User = User_1 = class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        Object.setPrototypeOf(this, User_1.prototype);
    }
};
__decorate([
    (0, decorators_1.PrimaryKey)(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, decorators_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
User = User_1 = __decorate([
    decorators_1.Entity,
    __metadata("design:paramtypes", [String, String])
], User);
const user = new User('test', 'test');
// console.log(getTableName(user));
// console.log(getColumn(user, 'id'));
// console.log(getColumn(user, 'name'));
console.log(user);
console.log(user.constructor.name);
(() => __awaiter(void 0, void 0, void 0, function* () {
    orm_1.ORM.register([User]);
    const orm = yield orm_1.ORM.connect();
    console.log(orm.entities);
    yield orm.entities.user.find({});
}))();
