import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id: string = v4();

  @Property({ unique: true })
  email: string;

  @Property()
  password: string;

  @Property()
  name: string;
}
