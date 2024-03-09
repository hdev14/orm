import "reflect-metadata";
import { Column, Entity, PrimaryKey } from "./decorators";
import PgORM from "./pg_orm";

@Entity
class User {
  @PrimaryKey()
  id: string;

  @Column({ type: 'varchar' })
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
  const ORM = new PgORM();

  await ORM.register([User]);
})();