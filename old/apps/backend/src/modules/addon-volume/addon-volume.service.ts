import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

import { AddonVolume } from './addon-volume.entity';
import { AddonVolumeRequestDto } from './addon-volume.dto';

@Injectable()
export class AddonVolumeService {
  constructor(
    @InjectRepository(AddonVolume)
    private repository: EntityRepository<AddonVolume>,
    private em: EntityManager,
  ) {}

  async create(data: AddonVolumeRequestDto): Promise<AddonVolume> {
    if (this.repository.findOne({ path: data.path, addon: data.addonId })) {
      throw new ConflictException('Addon Volume already exists');
    }

    const created = this.repository.create({
      path: data.path,
      size: data.size,
      accessMode: data.accessMode,
      addon: data.addonId,
    });

    this.em.persistAndFlush(created);

    return await this.repository.findOne({
      path: data.path,
      addon: data.addonId,
    });
  }
}
