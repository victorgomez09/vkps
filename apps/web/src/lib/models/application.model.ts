import type { Addon } from './addon.model';
import type { Pod } from './pod.model';

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
	deployments: ApplicationDeployments[];
	addon?: Addon;
	pods: Pod[];
	creationDate: Date;
	updateTime: Date;
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
};
