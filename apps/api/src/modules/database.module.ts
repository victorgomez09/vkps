import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/config/config.module';
import { DatabaseController } from 'src/controllers/database.controller';
import { DatabaseService } from 'src/services/database.service';

@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService],
  imports: [ConfigurationModule],
})
export class DatabaseModule {}
