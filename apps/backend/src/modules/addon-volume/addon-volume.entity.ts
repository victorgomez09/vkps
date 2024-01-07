import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

import { Addon } from '../addon/addon.entity';

@Entity({ tableName: 'addon_volumes' })
export class AddonVolume {
  @PrimaryKey()
  id: string = v4();

  @Property()
  path: string;

  @Property()
  size: string;

  @Property()
  accessMode:
    | 'ReadWriteOnce'
    | 'ReadOnlyMany'
    | 'ReadWriteMany'
    | 'ReadWriteOncePod';

  @ManyToOne(() => Addon)
  addon: Addon;

  @Property({ onCreate: () => new Date() })
  creationDate: Date;

  @Property({ onUpdate: () => new Date() })
  updateTime: Date;
}
