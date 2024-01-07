import {
  EntityManager,
  EntityRepository,
  NotFoundError,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { AddonVersionService } from '../addon-version/addon-version.service';
import { AddonEnvService } from '../addon-env/addon-env.service';
import { AddonVolumeService } from '../addon-volume/addon-volume.service';

import { Addon } from './addon.entity';
import { AddonRequestDto } from './addon.dto';

@Injectable()
export class AddonService {
  constructor(
    @InjectRepository(Addon)
    private repository: EntityRepository<Addon>,
    private em: EntityManager,
    private addonVersionService: AddonVersionService,
    private addonEnvService: AddonEnvService,
    private addonVolumeService: AddonVolumeService,
  ) {}

  findAll(): Promise<Addon[]> {
    return this.repository.findAll({
      populate: ['volumes', 'envs', 'versions'],
    });
  }

  findById(id: string): Promise<Addon> {
    const addon = this.repository.findOne(
      { id },
      {
        populate: ['volumes', 'envs', 'versions'],
      },
    );

    if (!addon) {
      throw new NotFoundError('Addon not found');
    }

    return addon;
  }

  async create(data: AddonRequestDto): Promise<Addon> {
    if (this.repository.findOne({ name: data.name })) {
      throw new Error('Addon already exists');
    }

    const created = this.repository.create({
      name: data.name,
      description: data.description,
      logo: data.logo,
    });

    this.em.persistAndFlush(created);

    const addon = await this.repository.findOne({ name: created.name });

    if (data.versions) {
      await this.addonVersionService.create({
        addonId: addon.id,
        version: data.versions.version,
      });
    }

    if (data.envs.length > 0) {
      data.envs.forEach(async (env) => {
        await this.addonEnvService.create({
          addonId: addon.id,
          key: env.key,
          value: env.value,
        });
      });
    }

    if (data.volumes.length > 0) {
      data.volumes.forEach(async (volume) => {
        await this.addonVolumeService.create({
          addonId: addon.id,
          path: volume.path,
          size: volume.size,
          accessMode: volume.accessMode,
        });
      });
    }

    return addon;
  }
}
