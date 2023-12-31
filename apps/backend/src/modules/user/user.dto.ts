import { IsString } from 'class-validator';

export class UserRequestDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
