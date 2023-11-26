export type Deployment = {
	id: string;
	deploymentId: string;
	name: string;
	description: string;
	replicas: number;
	memory: number;
	cpu: number;
	templateId: string;
	creationDate: Date;
	updateTime: Date;
};
