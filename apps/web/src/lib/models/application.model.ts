import type { Addon } from './template.model';

export type Application = {
	id: string;
	applicationId: string;
	name: string;
	description: string;
	replicas: number;
	workingReplicas: number;
	totalReplicas: number;
	memory: number;
	cpu: number;
	addon?: Addon;
	creationDate: Date;
	updateTime: Date;
};

export type ApplicationDetails = Application & {
	pods: [];
	env: ApplicationEnv;
	volumes: ApplicationVolume[];
};

export type ApplicationEnv = {
	[key: string]: string;
};

export type ApplicationVolume = {
	path: string;
	size: number;
	accessMode: string[];
};
