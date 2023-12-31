import { IsDate, IsString } from 'class-validator';

export class DeploymentVolumeRequestDto {
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
  deploymentId: string;

  @IsDate()
  creationDate: Date;

  @IsDate()
  updateTime: Date;
}

export class DeploymentVolumeDto {
  @IsString()
  id: string;

  @IsString()
  path: string;

  @IsString()
  size: string;

  @IsString()
  accessMode: string;

  @IsDate()
  creationDate: Date;

  @IsDate()
  updateTime: Date;
}
