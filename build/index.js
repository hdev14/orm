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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const decorators_1 = require("./decorators");
const pg_orm_1 = __importDefault(require("./pg_orm"));
let User = class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
};
__decorate([
    (0, decorators_1.PrimaryKey)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, decorators_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
User = __decorate([
    decorators_1.Entity,
    __metadata("design:paramtypes", [Number, String])
], User);
// console.log(getTableName(user));
// console.log(getColumn(user, 'id'));
// console.log(getColumn(user, 'name'));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const ORM = new pg_orm_1.default();
    yield ORM.register([User]);
    // const user = new User(1, 'test');
    // await ORM.entities.user.create(user);
    const [user] = yield ORM.entities.user.find({ id: 1 });
    // await ORM.entities.user.update({ id: user.id }, { name: 'update test' });
    yield ORM.entities.user.delete({ id: user.id });
    process.exit(1);
}))();
