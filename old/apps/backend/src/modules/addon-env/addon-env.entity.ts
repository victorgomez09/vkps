import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

import { Addon } from '../addon/addon.entity';

@Entity({ tableName: 'addon_envs' })
export class AddonEnv {
  @PrimaryKey()
  id: string = v4();

  @Property()
  key: string;

  @Property()
  value: string;

  @ManyToOne(() => Addon)
  addon: Addon;

  @Property({ onCreate: () => new Date() })
  creationDate: Date;

  @Property({ onUpdate: () => new Date() })
  updateTime: Date;
}
