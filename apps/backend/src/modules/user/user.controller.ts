import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/auth.jwt.guard';

import { UserService } from './user.service';
import { UserDto, UserRequestDto } from './user.dto';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Post('user')
  async signupUser(@Body() userData: UserRequestDto): Promise<UserDto> {
    return this.userService.createUser(userData);
  }
}
