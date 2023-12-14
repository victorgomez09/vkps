import { Module } from '@nestjs/common';
import { ApplicationModule } from './modules/application.module';

@Module({
  imports: [ApplicationModule],
})
export class AppModule { }
