import { V1ConfigMap, V1ContainerPort, V1PersistentVolumeClaim, V1VolumeMount } from "@kubernetes/client-node";
import { Application } from "@prisma/client";
import {
    Pod,
    createConfigMap,
    createDeployment,
    createPersistentVolume,
    createPersistentVolumeClaim,
    getDeployment,
    getDeploymentLogs,
    getPodsFromDeployment,
} from "engine";
import { parseName } from "engine/lib/utils.engine";

import { prisma } from "../config/database.config";
import { Queue } from "../queue/queue";
import { ApiResponse } from "../types";

type ApplicationResponse = Application & {
    workingReplicas: number;
    totalReplicas: number;
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
            const k8sDeployment = await getDeployment(applicationDb.applicationId, "default");
            if (k8sDeployment.statusCode !== 200 || !k8sDeployment.data) {
                continue;
            }

            applications.push({
                ...applicationDb,
                workingReplicas: k8sDeployment.data.status?.availableReplicas || 0,
                totalReplicas: k8sDeployment.data.status?.replicas || 0,
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
            },
        });
        const { statusCode, data } = await getDeployment(applicationDb.applicationId, "default");

        if (statusCode !== 200 || !data) {
            return {
                statusCode: 404,
                error: "Deployment not found",
            };
        }

        const application: ApplicationResponse = {
            ...applicationDb,
            workingReplicas: data.status?.availableReplicas || 0,
            totalReplicas: data.status?.replicas || 0,
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
        const { statusCode, data } = await getDeploymentLogs(name);

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
    namespace: string
): Promise<
    ApiResponse<{
        name: string;
        namespace: string;
        replicas: number;
        availableReplicas: number;
        pods: Pod[];
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

        return {
            statusCode: 200,
            data: {
                name: application.data.metadata.name,
                namespace: application.data.metadata.namespace,
                replicas: application.data.spec.replicas,
                availableReplicas: application.data.status.availableReplicas,
                pods: pods,
            },
        };
    } catch (error) {
        return {
            statusCode: error.statusCode,
            error: error.body.message,
        };
    }
};

export const deployAddon = async ({
    addonName,
    namespace,
    applicationName: deploymentName,
    description,
    version,
    replicas,
    cpu,
    memory,
    env,
    volumes,
    ports,
}: {
    addonName: string;
    namespace: string;
    applicationName: string;
    description: string;
    version: string;
    replicas: number;
    cpu: number;
    memory: number;
    env: { [key: string]: string };
    volumes: { path: string; size: string; accessMode: string[] }[];
    ports: V1ContainerPort[];
}): Promise<
    ApiResponse<{
        name: string;
        namespace: string;
        replicas: number;
    }>
> => {
    try {
        const addon = await prisma.addon.findFirst({
            where: { name: addonName },
            include: {
                env: true,
                versions: true,
                volumes: true,
            },
        });

        if (!addon) {
            return {
                statusCode: 404,
                error: "Addon not found",
            };
        }
        // Save on database
        const queue = Queue({
            queueTimeout: 500,
            executionTimeout: 250,
            concurrency: 1,
            maxTaskCount: 1,
        });
        queue
            .add(async () => {
                let configMap: V1ConfigMap;
                if (addon.env.length) {
                    const result = await createConfigMap({
                        namespace: namespace,
                        name: parseName(deploymentName),
                        labels: {
                            app: parseName(deploymentName),
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
                if (volumes.length > 0) {
                    for await (const volume of volumes) {
                        const pvData = await createPersistentVolume({
                            namespace: namespace,
                            name: parseName(deploymentName),
                            labels: {
                                app: parseName(deploymentName),
                            },
                            accessModes: volume.accessMode || ["ReadWriteOnce"],
                            storage: volume.size,
                            path: volume.path,
                        });
                        if (pvData.statusCode !== 201) {
                            return {
                                statusCode: pvData.statusCode,
                                error: pvData.error,
                            };
                        }

                        const pvcData = await createPersistentVolumeClaim({
                            namespace: namespace,
                            name: parseName(deploymentName),
                            labels: {
                                app: parseName(deploymentName),
                            },
                            accessModes: volume.accessMode || ["ReadWriteOnce"],
                            storage: volume.size,
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

                const result = await createDeployment({
                    namespace: namespace,
                    name: parseName(deploymentName),
                    labels: {
                        app: parseName(deploymentName),
                    },
                    image: `${addon.image}:${!version ? "latest" : version}`,
                    replicas: replicas,
                    ports: ports,
                    configMapRefName: configMap.metadata.name,
                    persistentVolumeClaimRefName: pvc.metadata.name,
                    volumeMounts,
                });

                return result;
            })
            .then((result) => {
                return {
                    statusCode: 201,
                    data: {
                        name: result.data.metadata.name,
                        namespace: result.data.metadata.namespace,
                        replicas: result.data.spec.replicas,
                    },
                };
            });

        // Add to database
        const deployment = await prisma.application.create({
            data: {
                applicationId: parseName(deploymentName),
                name: deploymentName,
                description: description,
                replicas: replicas,
                cpu: cpu,
                memory: memory,
                creationDate: new Date(),
                updateTime: new Date(),
                addon: {
                    connect: {
                        id: addon.id,
                    },
                },
            },
        });

        return {
            statusCode: 200,
            data: {
                name: deployment.name,
                namespace: namespace,
                replicas: replicas,
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
