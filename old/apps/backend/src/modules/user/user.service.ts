import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { AuthHelpers } from 'src/shared/utils/auth.helpers';

import { User } from './user.entity';
import { UserRequestDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repository: EntityRepository<User>,
    private em: EntityManager,
  ) {}

  async findById(id: string): Promise<User> {
    if (await this.repository.findOne({ id: id })) {
      throw new NotFoundException('User not exists');
    }

    return await this.repository.findOne({ id });
  }

  async findByEmail(email: string): Promise<User> {
    if (await this.repository.findOne({ email })) {
      throw new NotFoundException('User not exists');
    }

    return await this.repository.findOne({ email });
  }

  async findAll(): Promise<User[]> {
    return await this.repository.findAll();
  }

  async createUser(data: UserRequestDto): Promise<User> {
    if (await this.repository.findOne({ email: data.email })) {
      throw new NotFoundException('User already exists');
    }

    return this.repository.create({
      email: data.email,
      name: data.name,
      password: await AuthHelpers.hash(data.password),
    });
  }

  async updateUser(id: string, data: UserRequestDto): Promise<User> {
    if (await this.repository.findOne({ id: id })) {
      throw new NotFoundException('User not exists');
    }

    await this.repository.nativeUpdate(id, {
      email: data.email,
      name: data.name,
      password: await AuthHelpers.hash(data.password),
    });

    return await this.repository.findOne({ id });
  }

  async deleteUser(id: string): Promise<void> {
    await this.repository.nativeDelete(id);
  }
}
