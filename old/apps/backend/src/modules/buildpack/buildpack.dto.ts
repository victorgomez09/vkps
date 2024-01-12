import { IsArray, IsNumber, IsString } from 'class-validator';

export class BuildpackBuildRequestDto {
  @IsString()
  baseDirectory: string;

  @IsString()
  image: string;

  @IsString()
  version: string;

  @IsString()
  projectDir: string;

  @IsString()
  workdir: string;

  @IsNumber()
  port: number;

  @IsString()
  installCommand?: string;

  @IsString()
  buildCommand: string;

  @IsString()
  startCommand: string;

  @IsArray()
  env: {
    key: string;
    value: string;
  }[];
}
