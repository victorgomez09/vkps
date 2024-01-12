import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

import { Deployment } from '../deployment/deployment.entity';

@Entity({ tableName: 'deployment_volume' })
export class DeploymentVolume {
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

  @ManyToOne(() => Deployment)
  deployment: Deployment;

  @Property({ onCreate: () => new Date() })
  creationDate: Date;

  @Property({ onUpdate: () => new Date() })
  updateTime: Date;
}
