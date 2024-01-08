import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BuildpackVersion } from './buildpack-version.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

@Injectable()
export class BuildpackVersionservice {
  constructor(
    @InjectRepository(BuildpackVersion)
    private repository: EntityRepository<BuildpackVersion>,
    private em: EntityManager,
  ) {}

  async findByBuildpack(buildpack: string): Promise<BuildpackVersion[]> {
    return this.repository.find({ buildpack });
  }
}
