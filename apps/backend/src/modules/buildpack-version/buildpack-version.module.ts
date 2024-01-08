import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BuildpackVersion } from './buildpack-version.entity';
import { BuildpackService } from '../buildpack/buildpack.service';

@Module({
  imports: [MikroOrmModule.forFeature([BuildpackVersion])],
  providers: [BuildpackService],
  exports: [BuildpackService],
})
export class BuildpackModule {}
