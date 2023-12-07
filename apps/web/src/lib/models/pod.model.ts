export type Pod = {
	metadata: {
		name: string;
		namespace: string;
		labels: {
			[key: string]: string;
		};
		creationTimestamp: Date;
	};
	spec: {
		nodeName: string;
		restartPolicy: string;
		volumes: PodVolume[];
	};
	status: {
		hostIP: string;
		phase: string;
		podIP: string;
		startTime: Date;
	};
};

export type PodVolume = {
	name: string;
};
