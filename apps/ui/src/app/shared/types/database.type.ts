export type Database = {
  id: string;
  name: string;
  fancyName: string;
  description: string;
  icon: string;
  image: string;
  versions: DatabaseVersion[];
  volumes: DatabaseVolume[];
  env: DatabaseEnv;
  ports: DatabasePort[];
};

export type DatabaseVersion = {
  version: string;
};

export type DatabaseVolume = {
  path: string;
  size: string;
  accessMode: ['ReadWriteOnce'];
};

export type DatabaseEnv = {
  [key: string]: string;
};

export type DatabasePort = {
  name: string;
  port: number;
  targetPort: number;
};
