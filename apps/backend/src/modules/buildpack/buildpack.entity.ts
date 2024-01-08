import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { BuildpackVersion } from '../buildpack-version/buildpack-version.entity';
import { Deployment } from '../deployment/deployment.entity';

@Entity({ tableName: 'buildpacks' })
export class Buildpack {
  @PrimaryKey()
  id: string = v4();

  @Property()
  name: string;

  @OneToMany({
    entity: () => BuildpackVersion,
    mappedBy: 'buildpack',
    orphanRemoval: true,
  })
  versions: Collection<BuildpackVersion> = new Collection<BuildpackVersion>(
    this,
  );

  @OneToOne(() => Deployment)
  deployment: Deployment;

  @Property({ onCreate: () => new Date() })
  creationDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  modificationDate: Date = new Date();
}
