import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

import { AddonEnv } from './addon-env.entity';
import { AddonEnvRequestDto } from './addon-env.dto';

@Injectable()
export class AddonEnvService {
  constructor(
    @InjectRepository(AddonEnv) private repository: EntityRepository<AddonEnv>,
    private em: EntityManager,
  ) {}

  async create(data: AddonEnvRequestDto) {
    if (this.repository.findOne({ key: data.key, addon: data.addonId })) {
      throw new Error('Addon Env already exists');
    }
  }
}
