import { V1ContainerPort, V1VolumeMount } from '@kubernetes/client-node';

export type EngineData<T> = {
    statusCode: number;
    data?: T;
    error?: string;
};

export type Template = {
    namespace: string;
    name: string;
    fancyName: string;
    description: string;
    image: string;
    replicas: number;
    volumes: {
        path: string;
        size: string;
        accessMode?: string[];
    }[];
    env: {
        [key: string]: string;
    };
    ports: {
        name: string;
        port: number;
        targetPort: number;
    }[];
};

export type ConfigMap = {
    namespace: string;
    name: string;
    labels?: { [key: string]: string };
    data?: { [key: string]: string };
};

export type PersistentVolume = {
    namespace: string;
    name: string;
    labels: { [key: string]: string };
    accessModes: string[];
    storage: string;
    path: string;
};

export type PersistentVolumeClaim = {
    namespace: string;
    name: string;
    labels: { [key: string]: string };
    accessModes: string[];
    storage: string;
};

export type Deployment = {
    namespace: string;
    name: string;
    labels: { [key: string]: string };
    image: string;
    replicas: number;

    ports: V1ContainerPort[];
    configMapRefName?: string;
    volumeMounts?: V1VolumeMount[];
    persistentVolumeClaimRefName?: string;
};

export type Pod = {
    name: string;
    status: string;
    namespace: string;
    volumes?: {
        name: string;
        path: string;
    }[];
    env?: { [key: string]: string };
};
