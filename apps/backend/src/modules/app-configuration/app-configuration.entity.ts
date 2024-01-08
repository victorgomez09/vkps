import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ tableName: 'configuration' })
export class AppConfiguration {
  @PrimaryKey()
  id: string = v4();

  @Property()
  dockerRegistryPort: number;

  @Property({ onCreate: () => new Date() })
  creationDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updateDate: Date = new Date();
}
