import { V1ConfigMap, V1ContainerPort, V1PersistentVolumeClaim, V1VolumeMount } from "@kubernetes/client-node";
import { Deployment } from "@prisma/client";
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

type DeploymentResponse = Deployment & {
    workingReplicas: number;
    totalReplicas: number;
};

export const getDeployments = async (): Promise<ApiResponse<DeploymentResponse[]>> => {
    try {
        const deployments: DeploymentResponse[] = [];
        const deploymentsDb = await prisma.deployment.findMany({
            include: {
                template: true,
            },
        });

        for await (const deploymentDb of deploymentsDb) {
            console.log("loop iteration");
            const k8sDeployment = await getDeployment(deploymentDb.deploymentId, "default");
            if (k8sDeployment.statusCode !== 200 || !k8sDeployment.data) {
                continue;
            }

            deployments.push({
                ...deploymentDb,
                workingReplicas: k8sDeployment.data.status?.availableReplicas || 0,
                totalReplicas: k8sDeployment.data.status?.replicas || 0,
            });
        }

        console.log("deployments", deployments);
        return {
            statusCode: 200,
            data: deployments,
        };
    } catch (error) {
        return {
            statusCode: 500,
            error: error.message,
        };
    }
};

export const getDeploymentLogsByName = async (name: string) => {
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

export const getDeploymentByName = async (
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
        const deployment = await getDeployment(String(name), String(namespace));

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
                name: deployment.data.metadata.name,
                namespace: deployment.data.metadata.namespace,
                replicas: deployment.data.spec.replicas,
                availableReplicas: deployment.data.status.availableReplicas,
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

export const deployTemplate = async ({
    templateName,
    namespace,
    deploymentName,
    description,
    version,
    replicas,
    cpu,
    memory,
    env,
    volumes,
    ports,
}: {
    templateName: string;
    namespace: string;
    deploymentName: string;
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
        const template = await prisma.template.findFirst({
            where: { name: templateName },
            include: {
                env: true,
                versions: true,
                volumes: true,
            },
        });

        if (!template) {
            return {
                statusCode: 404,
                error: "Template not found",
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
                if (template.env.length) {
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
                        console.log("pvData", pvData.data.metadata.name);

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
                    image: `${template.image}:${!version ? "latest" : version}`,
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
        const deployment = await prisma.deployment.create({
            data: {
                deploymentId: parseName(deploymentName),
                name: deploymentName,
                description: description,
                replicas: replicas,
                cpu: cpu,
                memory: memory,
                creationDate: new Date(),
                updateTime: new Date(),
                template: {
                    connect: {
                        id: template.id,
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
