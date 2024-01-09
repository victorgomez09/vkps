import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/shared/database/database.module';

import { GLOBAL_CONFIG } from '../../configs/global.config';
import { LoggerMiddleware } from '../../middlewares/logger.middleware';
import { AuthModule } from '../auth/auth.module';
import { DeploymentEnvModule } from '../deployment-env/deployment-env.module';
import { DeploymentVolumeModule } from '../deployment-volume/deployment-volume.module';
import { DeploymentModule } from '../deployment/deployment.module';
import { LoggerModule } from '../logger/logger.module';
import { UserModule } from '../user/user.module';
import { AddonEnvModule } from '../addon-env/addon-env.module';
import { AddonVersionModule } from '../addon-version/addon-version.module';
import { AddonVolumeModule } from '../addon-volume/addon-volume.module';
import { AddonModule } from '../addon/addon.module';

import { AppService } from './app.service';
import { AppConfigurationModule } from '../app-configuration/app-configuration.module';
import { InitModule } from '../init/init.module';
import { Buildpack } from '../buildpack/buildpack.entity';
import { BuildpackVersion } from '../buildpack-version/buildpack-version.entity';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    AuthModule,
    UserModule,
    DeploymentModule,
    DeploymentEnvModule,
    DeploymentVolumeModule,
    AddonModule,
    AddonVersionModule,
    AddonEnvModule,
    AddonVolumeModule,
    AppConfigurationModule,
    Buildpack,
    BuildpackVersion,
    // InitModule,
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
  ],
  providers: [AppService],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
