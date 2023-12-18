import { Controller, Get } from '@nestjs/common';
import { Database } from '@prisma/client';
import { DatabaseService } from 'src/services/database.service';

@Controller('databases')
export class DatabaseController {
  constructor(private service: DatabaseService) {}

  @Get()
  async findAll(): Promise<Database[]> {
    return this.service.findAll();
  }
}
