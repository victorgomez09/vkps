import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Buildpack } from '../buildpack/buildpack.entity';

@Entity({ tableName: 'buildpack_versions' })
export class BuildpackVersion {
  @PrimaryKey()
  id: string = v4();

  @Property()
  version: string;

  @ManyToOne(() => Buildpack)
  buildpack: Buildpack;

  @Property({ onCreate: () => new Date() })
  creationDate: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  modificationDate: Date = new Date();
}
