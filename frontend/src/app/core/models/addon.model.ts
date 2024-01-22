export type Addon = {
  id?: string;
  name: string;
  fancyName: string;
  image: string;
  description: string;
  versions: AddonVersion[];
  envs: AddonEnv[];
  volumes: AddonVolume[];
  port: number;
  creationDate: Date;
  modificationDate: Date;
};

export type AddonVersion = {
  id?: string;
  version: string;
};

export type AddonEnv = {
  id?: string;
  key: string;
  value: string;
  optional: boolean;
};

export type AddonVolume = {
  id?: string;
  path: string;
  size: number;
  accessMode: string;
};
