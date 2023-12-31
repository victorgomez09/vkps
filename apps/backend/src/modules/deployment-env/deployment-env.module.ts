import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { DeploymentEnv } from './deployment-env.entity';
import { DeploymentEnvService } from './deployment-env.service';

@Module({
  imports: [MikroOrmModule.forFeature([DeploymentEnv])],
  controllers: [],
  providers: [DeploymentEnvService],
  exports: [DeploymentEnvService],
})
export class DeploymentEnvModule {}
