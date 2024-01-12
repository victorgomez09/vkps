export type Addon = {
	id?: string;
	name: string;
	fancyName: string;
	description: string;
	icon: string;
	image: string;
	env?: AddonEnv[];
	type: AddonType;
	versions: AddonVersion[];
	volumes?: AddonVolume[];
};

export type AddonEnv = {
	[key: string]: string;
};

export type AddonType = {
	type: 'DATABASE';
};

export type AddonVersion = {
	version: string;
};

export type AddonVolume = {
	path: string;
	accessMode: ['ReadWriteOnce'] | ['ReadWriteMany'];
	size: number;
};
