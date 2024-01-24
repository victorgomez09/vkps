export type Application = {
  id?: string;
  name: string;
  description: string;
  repositoryUrl?: string;
  dockerImage?: string;
  port: number;
  replicas: number;
  cpu: string;
  memory: string;
  envs: { key: string; value: string }[];
  volumes: { path: string; size: string }[];
};

export type ApplicationEnv = {
  id?: string;
  key: string;
  value: string;
};

export type ApplicationVolume = {
  id?: string;
  path: string;
  size: number;
};
