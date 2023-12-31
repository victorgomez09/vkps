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

import { DeploymentEnv } from '../deployment-env/deployment-env.entity';
import { DeploymentVolume } from '../deployment-volume/deployment-volume.entity';
import { Buildpack } from '../buildpack/buildpack.entity';

@Entity({ tableName: 'deployments' })
export class Deployment {
  @PrimaryKey()
  id: string = v4();

  @Property()
  deploymentId: string;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property({ nullable: true })
  repositoryUrl: string;

  @Property({ nullable: true })
  image: string;

  @Property()
  replicas: number;

  @Property()
  memory: string;

  @Property()
  cpu: string;

  @Property()
  exposedNetwork: boolean;

  @Property()
  port: number;

  @OneToMany({
    entity: () => DeploymentEnv,
    mappedBy: 'deployment',
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  envs: Collection<DeploymentEnv> = new Collection<DeploymentEnv>(this);

  @OneToMany({
    entity: () => DeploymentVolume,
    mappedBy: 'deployment',
    cascade: [Cascade.REMOVE],
  })
  volumes: Collection<DeploymentVolume> = new Collection<DeploymentVolume>(
    this,
  );

  @OneToOne(() => Buildpack)
  buildpack?: Buildpack;

  @Property({ onCreate: () => new Date() })
  creationDate: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updateTime: Date;
}
