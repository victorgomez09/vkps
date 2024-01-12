import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserListener } from './user.listener';
import { User } from './user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserListener],
  exports: [UserService],
})
export class UserModule {}
