import { IsString } from 'class-validator';

export class AddonVolumeDto {
  @IsString()
  id: string;

  @IsString()
  path: string;

  @IsString()
  size: string;

  @IsString()
  accessMode: string;
}

export class AddonVolumeRequestDto {
  @IsString()
  path: string;

  @IsString()
  size: string;

  @IsString()
  accessMode:
    | 'ReadWriteOnce'
    | 'ReadOnlyMany'
    | 'ReadWriteMany'
    | 'ReadWriteOncePod';

  @IsString()
  addonId: string;
}
