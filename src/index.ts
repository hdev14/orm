import "reflect-metadata";
import { Column, Entity, PrimaryKey } from "./decorators";
import { ORM } from "./orm";

@Entity
class User {
  @PrimaryKey()
  id: string;

  @Column()
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

const user = new User('test', 'test');

// console.log(getTableName(user));
// console.log(getColumn(user, 'id'));
// console.log(getColumn(user, 'name'));
console.log(user);
console.log(user.constructor.name);

(async () => {
  ORM.register([User]);
  const orm = await ORM.connect();

  console.log(orm.entities);
  await orm.entities.user.find({});

})();