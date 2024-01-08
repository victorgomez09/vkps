import { Module } from '@nestjs/common';
import { AppConfigurationModule } from '../app-configuration/app-configuration.module';
import { InitService } from './init.service';

@Module({
  imports: [AppConfigurationModule],
  providers: [InitService],
  exports: [InitService],
})
export class InitModule {}
