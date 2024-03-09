import "reflect-metadata";
import { Column, Entity, PrimaryKey } from "./decorators";
import PgORM from "./pg_orm";

@Entity
class User {
  @PrimaryKey()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}



// console.log(getTableName(user));
// console.log(getColumn(user, 'id'));
// console.log(getColumn(user, 'name'));

(async () => {
  const ORM = new PgORM();

  await ORM.register([User]);

  // const user = new User(1, 'test');

  // await ORM.entities.user.create(user);

  const [user] = await ORM.entities.user.find<User>({ id: 1 });
  // await ORM.entities.user.update({ id: user.id }, { name: 'update test' });
  await ORM.entities.user.delete({ id: user.id });

  process.exit(1);
})();