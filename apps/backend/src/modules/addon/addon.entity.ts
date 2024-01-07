import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

import { AddonVersion } from '../addon-version/addon-version.entity';
import { AddonVolume } from '../addon-volume/addon-volume.entity';
import { AddonEnv } from '../addon-env/addon-env.entity';

@Entity({ tableName: 'addons' })
export class Addon {
  @PrimaryKey()
  id: string = v4();

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  logo: string;

  @OneToOne(() => AddonVersion)
  versions: AddonVersion;

  @OneToMany({
    entity: () => AddonVolume,
    mappedBy: 'addon',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  volumes: Collection<AddonVolume> = new Collection<AddonVolume>(this);

  @OneToMany({
    entity: () => AddonEnv,
    mappedBy: 'addon',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  envs: Collection<AddonEnv> = new Collection<AddonEnv>(this);

  @Property({ onCreate: () => new Date() })
  creationDate: Date;

  @Property({ onUpdate: () => new Date() })
  updateTime: Date;
}
