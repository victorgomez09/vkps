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
