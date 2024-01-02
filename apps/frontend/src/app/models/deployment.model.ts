import { DeploymentVolume } from './deployment-volume.model';
import { DeploymentEnv } from './deploymentenv.model';

export class Deployment {
  id!: string;
  deploymentId!: string;
  name!: string;
  description?: string;
  image!: string;
  memory!: string;
  cpu!: string;
  exposedNetwork!: boolean;
  port!: number;
  status!: string;
  namespace!: string;
  workingReplicas!: number;
  totalReplicas!: number;
  envs?: DeploymentEnv[];
  volumes?: DeploymentVolume[];
  creationDate!: Date;
  updateTime!: Date;
}

export class DeploymentRequest {
  name!: string;
  description?: string;
  image!: string;
  replicas!: string;
  memory!: string;
  cpu!: string;
  exposedNetwork!: boolean;
  port!: number;
  envs?: DeploymentEnv[];
  volumes?: DeploymentVolume[];
}
