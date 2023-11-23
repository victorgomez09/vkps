import { V1ConfigMap, V1Status } from '@kubernetes/client-node';
import * as http from 'http';

import { k8sCoreApi } from './utils.engine'
import { EngineData } from './types'

export type ConfigMap = {
    namespace: string;
    name: string;
    labels?: { [key: string]: string };
    data?: { [key: string]: string };
};

export const createConfigMap = async (
    configMap: ConfigMap
): Promise<EngineData<V1ConfigMap>> => {
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
            statusCode: response.statusCode || 200,
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
): Promise<EngineData<V1ConfigMap>> => {
    try {
        const { response, body: configMapData } =
            await k8sCoreApi.readNamespacedConfigMap(
                configMap.name,
                configMap.namespace
            );

        return {
            statusCode: response.statusCode || 200,
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
          body: V1Status;
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