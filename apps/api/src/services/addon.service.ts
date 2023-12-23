import { V1ConfigMap, V1PersistentVolumeClaim, V1VolumeMount } from "@kubernetes/client-node";
import { Addon } from "@prisma/client";
import { createConfigMap, createDeployment, createPersistentVolume, createPersistentVolumeClaim, parseName } from "engine";
import { prisma } from "../config/database.config";
import { Queue } from "../queue/queue";
import { ApiResponse } from "../types";

export const listAddons = async (): Promise<ApiResponse<Addon[]>> => {
    const addons = await prisma.addon.findMany({
        include: {
            env: true,
            type: true,
            versions: true,
            volumes: true,
        },
    });

    return {
        statusCode: 200,
        data: addons,
    };
};

export const getAddon = async (name: string): Promise<ApiResponse<Addon>> => {
    const addon = await prisma.addon.findFirst({
        where: {
            name,
        },
        include: {
            env: true,
            type: true,
            versions: true,
            volumes: true,
        },
    });
    delete addon.addonTypeId;
    addon.env.forEach((env) => {
        delete env.id;
        delete env.addonId;
    });
    addon.volumes.forEach((volume) => {
        delete volume.id;
        delete volume.addonId;
    });
    addon.versions.forEach((version) => {
        delete version.id;
        delete version.addonId;
    });
    delete addon.type.id;

    return {
        statusCode: 200,
        data: addon,
    };
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
    port,
}: {
    addonName: string;
    namespace: string;
    applicationName: string;
    description: string;
    version: string;
    replicas: number;
    cpu: string;
    memory: string;
    env: { [key: string]: string };
    volumes: { path: string; size: string; accessMode: string[] }[];
    port: number;
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
                    cpu: cpu,
                    memory: memory,
                    port,
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
                image: addon.image,
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
