import { V1ConfigMap, V1PersistentVolumeClaim, V1Pod, V1VolumeMount } from "@kubernetes/client-node";
import { Application } from "@prisma/client";
import {
    Pod,
    createClusterIpService,
    createConfigMap,
    createDeployment,
    createNodePortService,
    createPersistentVolume,
    createPersistentVolumeClaim,
    getDeployment,
    getDeploymentLogs,
    getPodsFromDeployment,
    getServiceByName,
    updateDeploymentCpu,
    updateDeploymentImage,
    updateDeploymentMemory,
    updateDeploymentReplicas,
} from "engine";
import { parseName } from "engine/lib/utils.engine";

import { prisma } from "../config/database.config";
import { NAMESPACE } from "../constants/k8s.constant";
import { Queue } from "../queue/queue";
import { ApiResponse } from "../types";
import { Service } from "../types/service.type";

type ApplicationResponse = Application & {
    workingReplicas: number;
    totalReplicas: number;
    pods: V1Pod[];
    service?: Service;
};

export const getApplications = async (): Promise<ApiResponse<ApplicationResponse[]>> => {
    try {
        const applications: ApplicationResponse[] = [];
        const applicationsDb = await prisma.application.findMany({
            include: {
                addon: true,
            },
        });

        for await (const applicationDb of applicationsDb) {
            const k8sDeployment = await getDeployment(applicationDb.applicationId, NAMESPACE);
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

        return {
            statusCode: 200,
            data: applications,
        };
    } catch (error) {
        return {
            statusCode: 500,
            error: error.message,
        };
    }
};

export const getApplicationById = async (id: string): Promise<ApiResponse<ApplicationResponse>> => {
    try {
        const applicationDb = await prisma.application.findFirst({
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
        const { statusCode, data } = await getDeployment(applicationDb.applicationId, NAMESPACE);

        if (!data) {
            return {
                statusCode: 200,
                data: {
                    ...applicationDb,
                    workingReplicas: 0,
                    totalReplicas: 0,
                    pods: [],
                    service: undefined,
                },
            };
        }

        const { statusCode: serviceCode, data: service } = await getServiceByName(`${parseName(applicationDb.applicationId)}-service`, NAMESPACE);
        if (serviceCode !== 200) {
            return {
                statusCode: serviceCode,
                error: "Service not found",
            };
        }

        const application: ApplicationResponse = {
            ...applicationDb,
            workingReplicas: data.status?.availableReplicas || 0,
            totalReplicas: data.status?.replicas || 0,
            pods: data.pods,
            service,
        };

        return {
            statusCode,
            data: application,
        };
    } catch (error) {
        return {
            statusCode: 500,
            error: error.message,
        };
    }
};

export const getApplicationLogs = async (name: string) => {
    try {
        const { statusCode, data } = await getDeploymentLogs(parseName(name), NAMESPACE);

        return {
            statusCode,
            data,
        };
    } catch (error) {
        return {
            statusCode: 500,
            error: error.message,
        };
    }
};

export const getApplicationByName = async (
    name: string,
    namespace: string = NAMESPACE
): Promise<
    ApiResponse<{
        name: string;
        namespace: string;
        replicas: number;
        availableReplicas: number;
        pods: Pod[];
        service: Service;
    }>
> => {
    try {
        const application = await getDeployment(String(name), String(namespace));

        const pods: Pod[] = [];
        const podsData = await getPodsFromDeployment(String(name));
        if (podsData.statusCode !== 200) {
            return {
                statusCode: podsData.statusCode,
                error: podsData.error,
            };
        }

        podsData.data.items.forEach((pod) => {
            pods.push({
                name: pod.metadata.name,
                status: pod.status.phase,
                namespace: pod.metadata.namespace,
            });
        });

        // TODO: get service
        const { statusCode, data: service } = await getServiceByName(`${String(name)}-service`, String(namespace));
        if (statusCode !== 200) {
            return {
                statusCode,
                error: "Service not found",
            };
        }

        return {
            statusCode: 200,
            data: {
                name: application.data.metadata.name,
                namespace: application.data.metadata.namespace,
                replicas: application.data.spec.replicas,
                availableReplicas: application.data.status.availableReplicas,
                pods: pods,
                service,
            },
        };
    } catch (error) {
        return {
            statusCode: error.statusCode,
            error: error.body.message,
        };
    }
};

export const createApp = async ({
    name,
    description,
    image,
    replicas,
    cpu,
    memory,
    env,
    volumes,
    exposedNetwork,
    port,
}: {
    name: string;
    description: string;
    image: string;
    replicas: number;
    cpu: string;
    memory: string;
    env: { [key: string]: string };
    volumes: { path: string; size: string; accessMode: string[] }[];
    exposedNetwork: boolean;
    port: number;
}): Promise<ApiResponse<Application>> => {
    try {
        if (
            await prisma.application.findFirst({
                where: { name },
            })
        ) {
            return {
                statusCode: 409,
                error: `Application ${name} already exists`,
            };
        }

        const application = await prisma.application.create({
            data: {
                applicationId: parseName(name),
                name,
                description,
                image,
                replicas,
                cpu,
                memory,
                exposedNetwork,
                port: Number(port),
                creationDate: new Date(),
                updateTime: new Date(),
                // addon: {
                //     connect: {
                //         id: addon.id,
                //     },
                // },
            },
        });

        if (volumes.length > 0) {
            volumes.map(async (volume) => {
                await prisma.applicationVolume.create({
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

        if (Object.keys(env).length > 0) {
            Object.entries(env).map(async ([key, value]) => {
                console.log("key", key, "value", value);
                await prisma.applicationEnv.create({
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

        return {
            statusCode: 200,
            data: {
                ...application,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            error: error.message,
            statusCode: error.statusCode,
        };
    }
};

export const deployApplication = async (
    applicationId: string
): Promise<
    ApiResponse<{
        status: string;
    }>
> => {
    try {
        const application = await prisma.application.findFirst({
            where: { applicationId },
            include: {
                deployments: true,
                env: true,
                volumes: true,
            },
        });

        if (!application) {
            return {
                statusCode: 404,
                error: "Application not found",
            };
        }

        const { data: appDeployment } = await getDeployment(parseName(application.name), NAMESPACE);

        const queue = Queue({
            queueTimeout: 500,
            executionTimeout: 250,
            concurrency: 1,
            maxTaskCount: 1,
        });

        if (!appDeployment) {
            queue
                .add(async () => {
                    let configMap: V1ConfigMap;
                    if (application.env.length) {
                        const env = {} as {
                            [key: string]: string;
                        };
                        application.env.map((appEnv) => {
                            env[appEnv.key] = appEnv.value;
                        });
                        const result = await createConfigMap({
                            namespace: NAMESPACE,
                            name: parseName(application.name),
                            labels: {
                                app: parseName(application.name),
                            },
                            data: env,
                        });

                        if (result.statusCode !== 201) {
                            return {
                                statusCode: result.statusCode,
                                error: result.error,
                            };
                        }

                        configMap = result.data;
                    }

                    let pvc: V1PersistentVolumeClaim;
                    const volumeMounts: V1VolumeMount[] = [];
                    if (application.volumes.length > 0) {
                        for await (const volume of application.volumes) {
                            const pvData = await createPersistentVolume({
                                namespace: NAMESPACE,
                                name: parseName(application.name),
                                labels: {
                                    app: parseName(application.name),
                                },
                                accessModes: ["ReadWriteOnce"],
                                storage: volume.size.toString(),
                                path: volume.path,
                            });
                            if (pvData.statusCode !== 201) {
                                return {
                                    statusCode: pvData.statusCode,
                                    error: pvData.error,
                                };
                            }

                            const pvcData = await createPersistentVolumeClaim({
                                namespace: NAMESPACE,
                                name: parseName(application.name),
                                labels: {
                                    app: parseName(application.name),
                                },
                                accessModes: ["ReadWriteOnce"],
                                storage: volume.size.toString(),
                            });
                            if (pvcData.statusCode !== 201) {
                                return {
                                    statusCode: pvcData.statusCode,
                                    error: pvcData.error,
                                };
                            }
                            pvc = pvcData.data;

                            volumeMounts.push({
                                name: pvcData.data.metadata.name,
                                mountPath: volume.path,
                            });
                        }
                    }

                    const object = {
                        namespace: NAMESPACE,
                        name: parseName(application.name),
                        labels: {
                            app: parseName(application.name),
                        },
                        image: application.image,
                        replicas: application.replicas,
                        memory: application.memory,
                        cpu: application.cpu,
                        port: application.port,
                    };
                    console.log("object", object);
                    if (configMap) object["configMapRefName"] = configMap.metadata.name;
                    if (pvc) object["persistentVolumeClaimRefName"] = pvc.metadata.name;
                    if (volumeMounts.length > 0) object["volumeMounts"] = volumeMounts;

                    const result = await createDeployment(object);

                    if (application.exposedNetwork) {
                        createNodePortService(application.applicationId, NAMESPACE);
                    } else {
                        createClusterIpService(application.applicationId, NAMESPACE);
                    }

                    return result;
                })
                .then(async (result) => {
                    await prisma.applicationDeployments.create({
                        data: {
                            application: {
                                connect: {
                                    id: application.id,
                                },
                            },
                        },
                    });

                    return {
                        statusCode: 201,
                        data: {
                            name: result.data.metadata.name,
                            namespace: result.data.metadata.namespace,
                            replicas: result.data.spec.replicas,
                        },
                    };
                });
        }

        return {
            statusCode: 200,
            data: {
                status: "Deploying application",
            },
        };
    } catch (error) {
        console.log(error);
        return {
            error: error.message,
            statusCode: error.statusCode,
        };
    }
};

export const updateApplication = async (
    applicationId: string,
    data: {
        name: string;
        description: string;
        image: string;
        replicas: number;
        cpu: string;
        memory: string;
        env: { key: string; value: string }[];
        volumes: { path: string; size: number }[];
        exposedNetwork: boolean;
    }
) => {
    try {
        const applicationDb = await prisma.application.findFirst({
            where: {
                applicationId,
            },
            include: {
                deployments: true,
                env: true,
                volumes: true,
            },
        });

        if (applicationDb.replicas !== data.replicas) {
            await updateDeploymentReplicas(applicationDb.applicationId, NAMESPACE, data.replicas);
        }

        if (applicationDb.memory !== data.memory) {
            await updateDeploymentMemory(applicationDb.applicationId, NAMESPACE, data.memory);
        }

        if (applicationDb.cpu !== data.cpu) {
            await updateDeploymentCpu(applicationDb.applicationId, NAMESPACE, data.cpu);
        }

        if (applicationDb.image !== data.image) {
            await updateDeploymentImage(applicationDb.applicationId, NAMESPACE, data.image);
        }

        if (applicationDb.exposedNetwork !== data.exposedNetwork) {
            if (data.exposedNetwork) {
                await createNodePortService(applicationDb.applicationId, NAMESPACE);
            } else {
                await createClusterIpService(applicationDb.applicationId, NAMESPACE);
            }
        }

        const application = await prisma.application.update({
            where: {
                applicationId,
            },
            data: {
                name: data.name,
                description: data.description,
                image: data.image,
                cpu: data.cpu,
                memory: data.memory,
                replicas: data.replicas,
                exposedNetwork: data.exposedNetwork,
                env: {
                    deleteMany: {},
                    create: data.env,
                },
            },
        });

        return {
            statusCode: 200,
            data: application,
        };
    } catch (error) {
        return {
            error: error.message,
            statusCode: error.statusCode,
        };
    }
};
