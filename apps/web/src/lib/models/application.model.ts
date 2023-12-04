import type { Addon } from './addon.model';

export type Application = {
	id: string;
	applicationId: string;
	name: string;
	description: string;
	image: string;
	replicas: number;
	workingReplicas: number;
	totalReplicas: number;
	memory: number;
	cpu: number;
	env: ApplicationEnv;
	volumes: ApplicationVolume[];
	deployments: ApplicationDeployments[]
	addon?: Addon;
	creationDate: Date;
	updateTime: Date;
};

export type ApplicationDetails = Application & {
	pods: [];
};

export type ApplicationEnv = {
	[key: string]: string;
};

export type ApplicationVolume = {
	path: string;
	size: number;
	accessMode: string[];
};

export type ApplicationDeployments = {
	id: string;
	creationDate: Date;
}