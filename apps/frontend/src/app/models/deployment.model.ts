import { DeploymentVolume } from './deployment-volume.model';
import { DeploymentEnv } from './deploymentenv.model';

export class Deployment {
  id!: string;
  deploymentId!: string;
  name!: string;
  description?: string;
  image!: string;
  replicas!: number;
  memory!: string;
  cpu!: string;
  exposedNetwork!: boolean;
  port!: number;
  status!: string;
  envs?: DeploymentEnv[];
  volumes?: DeploymentVolume[];
  creationDate!: Date;
  updateTime!: Date;
}
