import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AddonVersionModule } from '../addon-version/addon-version.module';

import { Addon } from './addon.entity';
import { AddonController } from './addon.controller';
import { AddonService } from './addon.service';

@Module({
  imports: [MikroOrmModule.forFeature([Addon]), AddonVersionModule],
  controllers: [AddonController],
  providers: [AddonService],
})
export class AddonModule {}
