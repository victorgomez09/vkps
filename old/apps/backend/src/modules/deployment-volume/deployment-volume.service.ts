import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { DeploymentVolumeRequestDto } from './deployment-volume.dto';
import { DeploymentVolume } from './deployment-volume.entity';

@Injectable()
export class DeploymentVolumeService {
  constructor(
    @InjectRepository(DeploymentVolume)
    private repository: EntityRepository<DeploymentVolume>,
    private em: EntityManager,
  ) {}

  async findAll(): Promise<DeploymentVolume[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<DeploymentVolume | null> {
    if (this.repository.findOne({ id: id })) {
      throw new NotFoundException('Deployment Volume not exists');
    }

    return this.repository.findOne({ id });
  }

  async create(data: DeploymentVolumeRequestDto): Promise<DeploymentVolume> {
    const created = this.repository.create({
      deployment: data.deploymentId,
      path: data.path,
      size: data.size,
      accessMode: data.accessMode,
    });

    await this.em.persistAndFlush(created);

    return await this.repository.findOne({
      deployment: data.deploymentId,
      path: data.path,
    });
  }
}
