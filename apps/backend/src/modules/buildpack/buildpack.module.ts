import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Buildpack } from './buildpack.entity';
import { BuildpackService } from './buildpack.service';

@Module({
  imports: [MikroOrmModule.forFeature([Buildpack])],
  providers: [BuildpackService],
  exports: [BuildpackService],
})
export class BuildpackModule {}
