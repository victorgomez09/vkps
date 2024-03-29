import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Buildpack } from './buildpack.entity';
import { searchFile } from 'src/shared/utils/file.util';
import createNodeDockerfile from 'src/shared/buildpacks/node';
import { BuildpackBuildRequestDto } from './buildpack.dto';
import { executeCommand } from 'src/shared/utils/exec.util';

@Injectable()
export class BuildpackService {
  constructor(
    @InjectRepository(Buildpack)
    private repository: EntityRepository<Buildpack>,
    private em: EntityManager,
  ) {}

  async findAll(): Promise<Buildpack[]> {
    return this.repository.findAll();
  }

  async findByName(name: string): Promise<Buildpack> {
    const buildpack = await this.repository.findOne({ name });
    if (!buildpack) {
      throw new NotFoundException('Buildpack not found');
    }

    return buildpack;
  }

  async selectBuildPack(projectDir: string): Promise<Buildpack> {
    let buildpack: Buildpack;

    if (searchFile(projectDir, 'package.json')) {
      buildpack = await this.findByName('nodejs');
    }

    return buildpack;
  }

  async build(data: BuildpackBuildRequestDto): Promise<void> {
    // TODO: select buildback based on language
    let buildpack: string;
    if (searchFile(data.projectDir, 'package.json')) {
      buildpack = 'nodejs';
      this.repository;
    }

    switch (buildpack) {
      case 'nodejs':
        createNodeDockerfile({
          baseDirectory: data.baseDirectory,
          baseImage: `${data.image}:${data.version}`,
          buildCommand: data.buildCommand,
          installCommand: data.installCommand,
          startCommand: data.startCommand,
          workdir: data.projectDir,
          port: data.port,
          envs: data.env,
        });

        executeCommand(`docker build -t :v1.0.0 .`, data.projectDir);

        break;
      default:
        break;
    }
  }
}
