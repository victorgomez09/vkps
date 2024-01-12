import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AddonEnv } from './addon-env.entity';
import { AddonEnvController } from './addon-env.controller';
import { AddonEnvService } from './addon-env.service';

@Module({
  imports: [MikroOrmModule.forFeature([AddonEnv])],
  controllers: [AddonEnvController],
  providers: [AddonEnvService],
  exports: [AddonEnvService],
})
export class AddonEnvModule {}
