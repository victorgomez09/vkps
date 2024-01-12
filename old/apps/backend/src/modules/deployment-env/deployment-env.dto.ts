import { IsDate, IsString } from 'class-validator';

export class DeploymentEnvRequestDto {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsString()
  description: string;

  @IsString()
  deploymentId: string;
}

export class DeploymentEnvDto {
  @IsString()
  id: string;

  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsString()
  description: string;

  @IsDate()
  creationDate: Date;

  @IsDate()
  updateTime: Date;
}
