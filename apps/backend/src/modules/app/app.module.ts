import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/shared/database/database.module';

import { GLOBAL_CONFIG } from '../../configs/global.config';
import { LoggerMiddleware } from '../../middlewares/logger.middleware';
import { AuthModule } from '../auth/auth.module';
import { DeploymentModule } from '../deployment/deployment.module';
import { LoggerModule } from '../logger/logger.module';
import { UserModule } from '../user/user.module';
import { DeploymentEnvModule } from '../deployment-env/deployment-env.module';
import { DeploymentVolumeModule } from '../deployment-volume/deployment-volume.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    AuthModule,
    UserModule,
    DeploymentModule,
    DeploymentEnvModule,
    DeploymentVolumeModule,
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
