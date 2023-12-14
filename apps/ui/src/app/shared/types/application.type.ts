export type Application = {
    id: string;
    applicationId: string;
    name: string;
    description: string;
    image: string;
    replicas: number;
    memory: number;
    cpu: number;
    addonId: string;
    creationDate: Date;
    updateTime: Date;

    workingReplicas: number;
    totalReplicas: number;
    pods: any[];
}

export type CreateApplication = {
    name: string;
    description: string;
    image: string;
    replicas: number;
    cpu: number;
    memory: number;
    env: { [key: string]: string };
    volumes: { path: string; size: string; accessMode: string[] }[];
}