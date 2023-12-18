import { Module } from '@nestjs/common';
import { ApplicationModule } from './modules/application.module';
import { DatabaseModule } from './modules/database.module';

@Module({
  imports: [ApplicationModule, DatabaseModule],
})
export class AppModule {}
