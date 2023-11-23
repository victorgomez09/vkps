import { V1PersistentVolume } from "@kubernetes/client-node";

import { k8sCoreApi } from "./utils.engine";
import { EngineData } from './types'

export type PersistentVolume = {
    namespace: string;
    name: string;
    labels: { [key: string]: string };
    accessModes: string[];
    storage: string;
    path: string;
};

export const createPersistentVolume = async (
    volume: PersistentVolume
): Promise<EngineData<V1PersistentVolume>> => {
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
            statusCode: response.statusCode || 200,
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
