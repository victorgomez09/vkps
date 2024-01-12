import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConflictException, Injectable } from '@nestjs/common';

import { DeploymentEnv } from './deployment-env.entity';
import { DeploymentEnvRequestDto } from './deployment-env.dto';

@Injectable()
export class DeploymentEnvService {
  constructor(
    @InjectRepository(DeploymentEnv)
    private repository: EntityRepository<DeploymentEnv>,
    private em: EntityManager,
  ) {}

  async create(data: DeploymentEnvRequestDto): Promise<DeploymentEnv> {
    if (
      this.repository.findOne({ deployment: data.deploymentId, key: data.key })
    ) {
      throw new ConflictException('Env already exists');
    }

    const env = this.repository.create({
      deployment: data.deploymentId,
      description: data.description,
      key: data.key,
      value: data.value,
    });

    await this.em.persistAndFlush(env);

    return this.repository.findOne({
      deployment: data.deploymentId,
      key: data.key,
    });
  }
}
