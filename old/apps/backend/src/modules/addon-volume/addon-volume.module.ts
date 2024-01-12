import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AddonVolumeService } from './addon-volume.service';
import { AddonVolumeController } from './addon-volume.controller';
import { AddonVolume } from './addon-volume.entity';

@Module({
  imports: [MikroOrmModule.forFeature([AddonVolume])],
  controllers: [AddonVolumeController],
  providers: [AddonVolumeService],
  exports: [AddonVolumeService],
})
export class AddonVolumeModule {}
