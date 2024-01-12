import { IsString } from 'class-validator';

export class AddonEnvDto {
  @IsString()
  id: string;

  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class AddonEnvRequestDto {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsString()
  addonId: string;
}
