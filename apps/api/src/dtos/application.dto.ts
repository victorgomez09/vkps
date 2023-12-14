import { Application } from "@prisma/client";

export type ApplicationResponse = Application & {
    workingReplicas: number;
    totalReplicas: number;
    pods: any[];
};

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