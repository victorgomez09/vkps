import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AddonVersionController } from './addon-version.controller';
import { AddonVersionService } from './addon-version.service';
import { AddonVersion } from './addon-version.entity';

@Module({
  imports: [MikroOrmModule.forFeature([AddonVersion])],
  controllers: [AddonVersionController],
  providers: [AddonVersionService],
  exports: [AddonVersionService],
})
export class AddonVersionModule {}
