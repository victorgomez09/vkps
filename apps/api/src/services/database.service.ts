import { Injectable, Logger } from '@nestjs/common';
import { Database } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class DatabaseService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Database[]> {
    try {
      return this.prisma.database.findMany({
        include: {
          env: true,
          versions: true,
          volumes: true,
        },
      });
    } catch (error) {
      Logger.error(error);

      return [];
    }
  }
}
