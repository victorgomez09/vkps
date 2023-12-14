import { Injectable, Logger } from "@nestjs/common";
import { Application } from "@prisma/client";
import { LogLines, getDeployment, getDeploymentLogs } from 'engine';
import { parseName } from "engine";

import { PrismaService } from "src/config/prisma.service";
import { ApplicationResponse, CreateApplication } from "src/dtos/application.dto";

@Injectable()
export class ApplicationService {

    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<ApplicationResponse[]> {
        try {
            const applications: ApplicationResponse[] = [];
            const applicationsDb = await this.prisma.application.findMany({
                include: {
                    addon: true,
                },
            });

            for await (const applicationDb of applicationsDb) {
                const k8sDeployment = await getDeployment(applicationDb.applicationId, "default");
                if (k8sDeployment.statusCode !== 200 || !k8sDeployment.data) {
                    applications.push({
                        ...applicationDb,
                        workingReplicas: 0,
                        totalReplicas: 0,
                        pods: [],
                    });
                    continue;
                }

                applications.push({
                    ...applicationDb,
                    workingReplicas: k8sDeployment.data.status?.availableReplicas || 0,
                    totalReplicas: k8sDeployment.data.status?.replicas || 0,
                    pods: k8sDeployment.data.pods || [],
                });
            }

            return applications
        } catch (error) {
            Logger.error(error)

            return []
        }
    }

    async findById(id: string): Promise<ApplicationResponse> {
        try {
            const applicationDb = await this.prisma.application.findFirst({
                where: {
                    applicationId: id,
                },
                include: {
                    addon: true,
                    deployments: true,
                    env: true,
                    volumes: true,
                },
            });
            const { statusCode, data } = await getDeployment(applicationDb.applicationId, "default");

            if (!data) {
                return {
                    ...applicationDb,
                    workingReplicas: 0,
                    totalReplicas: 0,
                    pods: [],
                };
            }

            const application: ApplicationResponse = {
                ...applicationDb,
                workingReplicas: data.status?.availableReplicas || 0,
                totalReplicas: data.status?.replicas || 0,
                pods: data.pods,
            };

            return application;
        } catch (error) {
            Logger.error(error)

            return {} as ApplicationResponse;
        }
    }

    async findLogs(name: string): Promise<LogLines[]> {
        try {
            const { statusCode, data } = await getDeploymentLogs(parseName(name));

            return data;
        } catch (error) {
            Logger.error(error.message)

            return []
        }
    }

    async create(data: CreateApplication): Promise<Application> {
        try {
            if (
                await this.prisma.application.findFirst({
                    where: { name: data.name },
                })
            ) {
                Logger.error(`Application ${name} already exists`)

                return {} as Application;
            }

            const application = await this.prisma.application.create({
                data: {
                    applicationId: parseName(data.name),
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    replicas: data.replicas,
                    cpu: data.cpu,
                    memory: data.memory,
                    creationDate: new Date(),
                    updateTime: new Date(),
                    // addon: {
                    //     connect: {
                    //         id: addon.id,
                    //     },
                    // },
                },
            });

            if (data.volumes.length > 0) {
                data.volumes.map(async (volume) => {
                    await this.prisma.applicationVolume.create({
                        data: {
                            path: volume.path,
                            size: Number(volume.size),
                            application: {
                                connect: {
                                    id: application.id,
                                },
                            },
                        },
                    });
                });
            }

            if (Object.keys(data.env).length > 0) {
                Object.entries(data.env).map(async ([key, value]) => {
                    await this.prisma.applicationEnv.create({
                        data: {
                            key,
                            value,
                            application: {
                                connect: {
                                    id: application.id,
                                },
                            },
                        },
                    });
                });
            }

            return application;
        } catch (error) {
            Logger.error(error);

            return {} as Application
        }
    }
}