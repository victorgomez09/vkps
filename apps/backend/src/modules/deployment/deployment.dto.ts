import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';

import {
  DeploymentVolumeDto,
  DeploymentVolumeRequestDto,
} from '../deployment-volume/deployment-volume.dto';
import {
  DeploymentEnvDto,
  DeploymentEnvRequestDto,
} from '../deployment-env/deployment-env.dto';

import { Deployment } from './deployment.entity';

export class DeploymentDto {
  @IsString()
  id: string;

  @IsString()
  deploymentId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  repositoryUrl: string;

  @IsString()
  image: string;

  @IsNumber()
  replicas: number;

  @IsString()
  memory: string;

  @IsString()
  cpu: string;

  @IsBoolean()
  exposedNetwork: boolean;

  @IsNumber()
  port: number;

  @IsArray()
  envs?: DeploymentEnvDto[];

  @IsArray()
  volumes?: DeploymentVolumeDto[];

  @IsDate()
  creationDate: Date;

  @IsDate()
  updateTime: Date;

  constructor(deployment: Deployment) {
    this.id = deployment.id;
    this.deploymentId = deployment.deploymentId;
    this.name = deployment.name;
    this.description = deployment.description;
    this.repositoryUrl = deployment.repositoryUrl;
    this.image = deployment.image;
    this.replicas = deployment.replicas;
    this.memory = deployment.memory;
    this.cpu = deployment.cpu;
    this.exposedNetwork = deployment.exposedNetwork;
    this.port = deployment.port;
    this.envs = deployment.envs.getItems();
    this.volumes = deployment.volumes.getItems();
    this.creationDate = deployment.creationDate;
    this.updateTime = deployment.updateTime;
  }
}

export class DeploymentRequestDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  repositoryUrl?: string;

  @IsString()
  image?: string;

  @IsNumber()
  replicas: number;

  @IsString()
  cpu: string;

  @IsString()
  memory: string;

  @IsArray()
  envs: DeploymentEnvRequestDto[];

  @IsArray()
  volumes: DeploymentVolumeRequestDto[];

  @IsBoolean()
  exposedNetwork: boolean;

  @IsNumber()
  port: number;
}
