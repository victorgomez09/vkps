import { Options } from '@mikro-orm/core';
import { TSMigrationGenerator } from '@mikro-orm/migrations';

import { AddonEnv } from './src/modules/addon-env/addon-env.entity';
import { AddonVersion } from './src/modules/addon-version/addon-version.entity';
import { AddonVolume } from './src/modules/addon-volume/addon-volume.entity';
import { Addon } from './src/modules/addon/addon.entity';
import { DeploymentEnv } from './src/modules/deployment-env/deployment-env.entity';
import { DeploymentVolume } from './src/modules/deployment-volume/deployment-volume.entity';
import { Deployment } from './src/modules/deployment/deployment.entity';
import { User } from './src/modules/user/user.entity';
import { AppConfiguration } from './src/modules/app-configuration/app-configuration.entity';

const config: Options = {
  allowGlobalContext: true,
  entities: [
    AppConfiguration,
    User,
    Deployment,
    DeploymentEnv,
    DeploymentVolume,
    Addon,
    AddonEnv,
    AddonVolume,
    AddonVersion,
  ], // no need for `entitiesTs` this way
  dbName: 'vkps',
  type: 'sqlite', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  migrations: {
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: './migrations', // path to the folder with migrations
    pathTs: undefined, // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    snapshot: true, // save snapshot when creating new migrations
    emit: 'ts', // migration generation mode
    generator: TSMigrationGenerator, // migration generator, e.g. to allow custom formatting
  },
};

export default config;
