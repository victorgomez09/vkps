import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppConfiguration } from './app-configuration.entity';
import { AppConfigurationService } from './app-configuration.service';

@Module({
  imports: [MikroOrmModule.forFeature([AppConfiguration])],
  providers: [AppConfigurationService],
  exports: [AppConfigurationService],
})
export class AppConfigurationModule {}
