import { InjectRepository } from '@mikro-orm/nestjs';
import { ConflictException, Injectable } from '@nestjs/common';
import { AppConfiguration } from './app-configuration.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { AppConfigurationRequestDto } from './app-configuration.dto';

@Injectable()
export class AppConfigurationService {
  constructor(
    @InjectRepository(AppConfiguration)
    private repository: EntityRepository<AppConfiguration>,
    private em: EntityManager,
  ) {}

  async find(): Promise<AppConfiguration> {
    return (await this.repository.findAll())[0];
  }

  async create(data: AppConfigurationRequestDto): Promise<AppConfiguration> {
    if ((await this.repository.findAll()).length) {
      throw new ConflictException('Configuration already exists');
    }

    const created = this.repository.create({
      dockerRegistryPort: data.dockerRegistryPort,
    });

    await this.em.persistAndFlush(created);

    return this.find();
  }

  async update(data: AppConfigurationRequestDto): Promise<AppConfiguration> {
    const { id } = await this.find();
    await this.repository.nativeUpdate(
      { id },
      {
        dockerRegistryPort: data.dockerRegistryPort,
      },
    );

    return this.find();
  }
}
