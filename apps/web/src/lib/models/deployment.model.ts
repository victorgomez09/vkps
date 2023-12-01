import type { Template } from './template.model';

export type Deployment = {
	id: string;
	deploymentId: string;
	name: string;
	description: string;
	replicas: number;
	workingReplicas: number;
	totalReplicas: number;
	memory: number;
	cpu: number;
	template?: Template;
	creationDate: Date;
	updateTime: Date;
};

export type DeploymentDetails = Deployment & {
	pods: [];
	env: DeploymentEnv;
	volumes: DeploymentVolume[];
};

export type DeploymentEnv = {
	[key: string]: string;
};

export type DeploymentVolume = {
	path: string;
	size: number;
	accessMode: string[];
};
