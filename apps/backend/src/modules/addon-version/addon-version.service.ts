import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

import { AddonVersion } from './addon-version.entity';
import { AddonVersionRequestDto } from './addon-version.dto';

@Injectable()
export class AddonVersionService {
  constructor(
    @InjectRepository(AddonVersion)
    private repository: EntityRepository<AddonVersion>,
    private em: EntityManager,
  ) {}

  async create(data: AddonVersionRequestDto) {
    const created = this.repository.create(data);

    this.em.persistAndFlush(created);

    return await this.repository.findOne({ addon: data.addonId });
  }
}
