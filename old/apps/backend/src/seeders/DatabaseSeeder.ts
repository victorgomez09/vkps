import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { BuildpackVersion } from '../modules/buildpack-version/buildpack-version.entity';
import { Buildpack } from '../modules/buildpack/buildpack.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const nodeBuildpack = em.create(Buildpack, {
      name: 'nodejs',
    });

    const nodeVersions: { value: string; label: string }[] = [
      {
        value: 'node:lts',
        label: 'node:lts',
      },
      {
        value: 'node:18',
        label: 'node:18',
      },
      {
        value: 'node:17',
        label: 'node:17',
      },
      {
        value: 'node:16',
        label: 'node:16',
      },
      {
        value: 'node:14',
        label: 'node:14',
      },
      {
        value: 'node:12',
        label: 'node:12',
      },
    ];

    nodeVersions.forEach((version) => {
      em.create(BuildpackVersion, {
        buildpack: nodeBuildpack,
        version: version.value,
      });
    });

    em.create(Buildpack, {
      name: 'docker',
    });
  }
}
