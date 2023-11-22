import * as k8s from '@kubernetes/client-node';
import * as http from 'http';

import {
    ConfigMap,
    Deployment,
    EngineData,
    PersistentVolume,
    PersistentVolumeClaim,
} from '../models/engine.model';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
export const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

export const createConfigMap = async (
    configMap: ConfigMap
): Promise<EngineData<k8s.V1ConfigMap>> => {
    try {
        const { response, body: configMapData } =
            await k8sCoreApi.createNamespacedConfigMap(configMap.namespace, {
                apiVersion: 'v1',
                kind: 'ConfigMap',
                metadata: {
                    name: `${configMap.name}-cm`,
                    labels: configMap.labels,
                },
                data: configMap.data,
            });

        return {
            statusCode: response.statusCode,
            data: configMapData,
        };
    } catch (error) {
        return {
            error: error.body.message,
            statusCode: error.statusCode,
        };
    }
};

export const getConfigMap = async (
    configMap: ConfigMap
): Promise<EngineData<k8s.V1ConfigMap>> => {
    try {
        const { response, body: configMapData } =
            await k8sCoreApi.readNamespacedConfigMap(
                configMap.name,
                configMap.namespace
            );

        return {
            statusCode: response.statusCode,
            data: configMapData,
        };
    } catch (error) {
        return {
            error: error.body.message,
            statusCode: error.statusCode,
        };
    }
};

export const deleteConfigMap = async (
    configMap: ConfigMap
): Promise<
    | {
          response: http.IncomingMessage;
          body: k8s.V1Status;
      }
    | {
          error: string;
      }
> => {
    try {
        if (
            !(await k8sCoreApi.readNamespacedConfigMap(
                configMap.name,
                configMap.namespace
            ))
        ) {
            return {
                error: 'ConfigMap does not exist',
            };
        }

        return await k8sCoreApi.deleteNamespacedConfigMap(
            configMap.name,
            configMap.namespace
        );
    } catch (error) {
        return {
            error: (error as Error).message,
        };
    }
};

export const createPersistentVolume = async (
    volume: PersistentVolume
): Promise<EngineData<k8s.V1PersistentVolume>> => {
    try {
        const { response, body: persistentVolume } =
            await k8sCoreApi.createPersistentVolume({
                apiVersion: 'v1',
                kind: 'PersistentVolume',
                metadata: {
                    name: volume.name,
                    labels: volume.labels,
                },
                spec: {
                    storageClassName: `ls-${volume.name}`,
                    accessModes: volume.accessModes,
                    capacity: {
                        storage: volume.storage,
                    },
                    hostPath: {
                        path: volume.path,
                    },
                },
            });

        return {
            statusCode: response.statusCode,
            data: persistentVolume,
        };
    } catch (error) {
        return {
            error: error.body.message,
            statusCode: error.statusCode,
        };
    }
};

export const deletePersistentVolume = async (volume: PersistentVolume) => {
    try {
        if (!(await k8sCoreApi.readPersistentVolume(volume.name))) {
            return {
                error: 'PersistentVolume does not exist',
            };
        }

        return await k8sCoreApi.deletePersistentVolume(volume.name);
    } catch (error) {
        return {
            error: (error as Error).message,
        };
    }
};

export const getPersistentVolume = async (volume: PersistentVolume) => {
    try {
        if (!(await k8sCoreApi.readPersistentVolume(volume.name))) {
            return {
                error: 'PersistentVolume does not exist',
            };
        }

        return await k8sCoreApi.readPersistentVolume(volume.name);
    } catch (error) {
        return {
            error: (error as Error).message,
        };
    }
};

export const createPersistentVolumeClaim = async (
    pvClaim: PersistentVolumeClaim
): Promise<EngineData<k8s.V1PersistentVolumeClaim>> => {
    try {
        const { response, body: pvClaimData } =
            await k8sCoreApi.createNamespacedPersistentVolumeClaim(
                pvClaim.namespace,
                {
                    apiVersion: 'v1',
                    kind: 'PersistentVolumeClaim',
                    metadata: {
                        name: pvClaim.name,
                        labels: pvClaim.labels,
                    },
                    spec: {
                        storageClassName: `ls-${pvClaim.name}`,
                        accessModes: pvClaim.accessModes,
                        resources: {
                            requests: {
                                storage: pvClaim.storage,
                            },
                        },
                    },
                }
            );

        return {
            statusCode: response.statusCode,
            data: pvClaimData,
        };
    } catch (error) {
        return {
            statusCode: error.statusCode,
            error: error.body.message,
        };
    }
};

export const getPersistentVolumeClaim = async (
    pvClaim: PersistentVolumeClaim
) => {
    try {
        if (
            !(await k8sCoreApi.readNamespacedPersistentVolumeClaim(
                pvClaim.name,
                pvClaim.namespace
            ))
        ) {
            return {
                error: 'PersistentVolumeClaim does not exist',
            };
        }

        return await k8sCoreApi.readNamespacedPersistentVolumeClaim(
            pvClaim.name,
            pvClaim.namespace
        );
    } catch (error) {
        return {
            error: (error as Error).message,
        };
    }
};

export const deletePersistentVolumeClaim = async (
    pvClaim: PersistentVolumeClaim
) => {
    try {
        if (
            !(await k8sCoreApi.readNamespacedPersistentVolumeClaim(
                pvClaim.name,
                pvClaim.namespace
            ))
        ) {
            return {
                error: 'PersistentVolumeClaim does not exist',
            };
        }

        return await k8sCoreApi.deleteNamespacedPersistentVolumeClaim(
            pvClaim.name,
            pvClaim.namespace
        );
    } catch (error) {
        return {
            error: (error as Error).message,
        };
    }
};

export const createDeployment = async (
    deployment: Deployment
): Promise<EngineData<k8s.V1Deployment>> => {
    try {
        const { response, body: deploymentData } =
            await k8sAppsApi.createNamespacedDeployment(deployment.namespace, {
                apiVersion: 'apps/v1',
                kind: 'Deployment',
                metadata: {
                    name: deployment.name,
                    labels: deployment.labels,
                },
                spec: {
                    replicas: deployment.replicas,
                    selector: {
                        matchLabels: deployment.labels,
                    },
                    template: {
                        metadata: {
                            labels: deployment.labels,
                        },
                        spec: {
                            containers: [
                                {
                                    name: deployment.name,
                                    image: deployment.image,
                                    ports: deployment.ports,
                                    envFrom: [
                                        {
                                            configMapRef: {
                                                name: deployment.configMapRefName,
                                            },
                                        },
                                    ],
                                    volumeMounts: deployment.volumeMounts,
                                },
                            ],
                            volumes: [
                                {
                                    name: deployment.name,
                                    persistentVolumeClaim: {
                                        claimName:
                                            deployment.persistentVolumeClaimRefName,
                                    },
                                },
                            ],
                        },
                    },
                },
            });

        return {
            statusCode: response.statusCode,
            data: deploymentData,
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: error.statusCode,
            error: error.body.message,
        };
    }
};

export const getDeployment = async (
    name: string,
    namespace: string,
    pretty = 'false',
    options?: {
        headers: {
            [name: string]: string;
        };
    }
): Promise<EngineData<k8s.V1Deployment>> => {
    try {
        const { response, body: deploymentData } =
            await k8sAppsApi.readNamespacedDeployment(
                name,
                namespace,
                pretty,
                options
            );

        return {
            statusCode: response.statusCode,
            data: deploymentData,
        };
    } catch (error) {
        return {
            statusCode: error.statusCode,
            error: error.body.message,
        };
    }
};

export const deleteDeployment = async (
    name: string,
    namespace: string
): Promise<EngineData<k8s.V1Status>> => {
    try {
        const { response, body } = await k8sAppsApi.deleteNamespacedDeployment(
            name,
            namespace
        );

        return {
            statusCode: response.statusCode,
            data: body,
        };
    } catch (error) {
        return {
            statusCode: error.statusCode,
            error: error.body.message,
        };
    }
};

export const getPodsFromDeployment = async (
    deploymentName: string
): Promise<EngineData<k8s.V1PodList>> => {
    try {
        const { response, body: pods } =
            await k8sCoreApi.listPodForAllNamespaces(
                false,
                '',
                '',
                `app=${deploymentName}`
            );

        return {
            statusCode: response.statusCode,
            data: pods,
        };
    } catch (error) {
        return {
            statusCode: error.statusCode,
            error: error.body.message,
        };
    }
};
