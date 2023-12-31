import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { DeploymentVolume } from './deployment-volume.entity';
import { DeploymentVolumeService } from './deployment-volume.service';

@Module({
  imports: [MikroOrmModule.forFeature([DeploymentVolume])],
  providers: [DeploymentVolumeService],
  exports: [DeploymentVolumeService],
})
export class DeploymentVolumeModule {}
