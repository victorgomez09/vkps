import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { DeploymentEnvModule } from '../deployment-env/deployment-env.module';
import { DeploymentVolumeModule } from '../deployment-volume/deployment-volume.module';

import { DeploymentController } from './deployment.controller';
import { Deployment } from './deployment.entity';
import { DeploymentService } from './deployment.service';
import { BuildpackModule } from '../buildpack/buildpack.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Deployment]),
    DeploymentEnvModule,
    DeploymentVolumeModule,
    BuildpackModule,
  ],
  controllers: [DeploymentController],
  providers: [DeploymentService],
  exports: [DeploymentService],
})
export class DeploymentModule {}
