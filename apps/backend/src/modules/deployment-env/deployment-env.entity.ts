import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

import { Deployment } from '../deployment/deployment.entity';

@Entity({
  tableName: 'deployment_env',
})
export class DeploymentEnv {
  @PrimaryKey()
  id: string = v4();

  @Property()
  key: string;

  @Property()
  value: string;

  @Property()
  description: string;

  @ManyToOne(() => Deployment)
  deployment: Deployment;

  @Property({ onCreate: () => new Date() })
  creationDate: Date;

  @Property({ onUpdate: () => new Date() })
  updateTime: Date;
}
