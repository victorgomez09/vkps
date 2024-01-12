import { DeploymentVolume } from './deployment-volume.model';
import { DeploymentEnv } from './deploymentenv.model';

export class Deployment {
  id!: string;
  deploymentId!: string;
  name!: string;
  description?: string;
  repositoryUrl?: string;
  image?: string;
  memory!: string;
  cpu!: string;
  exposedNetwork!: boolean;
  port!: number;
  status!: string;
  namespace!: string;
  replicas!: number;
  workingReplicas!: number;
  totalReplicas!: number;
  pods?: any[];
  envs?: DeploymentEnv[];
  volumes?: DeploymentVolume[];
  creationDate!: Date;
  updateTime!: Date;
}

export class DeploymentRequest {
  name!: string;
  description?: string;
  repositoryUrl?: string;
  image?: string;
  replicas!: string;
  memory!: string;
  cpu!: string;
  exposedNetwork!: boolean;
  port!: number;
  envs?: DeploymentEnv[];
  volumes?: DeploymentVolume[];
}

export class DeploymentLogs {
  id!: string;
  time!: number;
  app!: string;
  pod!: string;
  podID!: string;
  container!: string;
  color!: string;
  log!: string;
}
