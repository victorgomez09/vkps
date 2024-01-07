import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

import { Addon } from '../addon/addon.entity';

@Entity({ tableName: 'addon_versions' })
export class AddonVersion {
  @PrimaryKey()
  id: string = v4();

  @Property()
  version: string[];

  @OneToOne(() => Addon)
  addon: Addon;
}
