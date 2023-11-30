export type Template = {
	id?: string;
	name: string;
	fancyName: string;
	description: string;
	icon: string;
	image: string;
	env?: TemplateEnv[];
	type: TemplateType;
	versions: TemplateVersion[];
	volumes?: TemplateVolume[];
};

export type TemplateEnv = {
	[key: string]: string;
};

export type TemplateType = {
	type: 'DATABASE';
};

export type TemplateVersion = {
	version: string;
};

export type TemplateVolume = {
	path: string;
	accessMode: ['ReadWriteOnce'] | ['ReadWriteMany'];
	size: number;
};
