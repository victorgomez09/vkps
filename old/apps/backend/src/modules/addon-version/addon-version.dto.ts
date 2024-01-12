import { IsArray, IsString } from 'class-validator';

export class AddonVersionDto {
  @IsString()
  id: string;

  @IsArray()
  version: string[];
}

export class AddonVersionRequestDto {
  @IsArray()
  version: string[];

  @IsString()
  addonId: string;
}
