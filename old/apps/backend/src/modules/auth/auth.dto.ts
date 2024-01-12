import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { INVALID_EMAIL } from '../../constants/strings';
import { UserDto } from '../user/user.dto';

export class AuthResponseDTO {
  user: UserDto;
  accessToken: string;
}

export class RegisterUserDTO {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class LoginUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail({}, { message: INVALID_EMAIL })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
