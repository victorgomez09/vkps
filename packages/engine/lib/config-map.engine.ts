import { V1ConfigMap } from '@kubernetes/client-node';

import { EngineData } from './types';
import { k8sCoreApi, parseName } from './utils.engine';

export type ConfigMap = {
  namespace: string;
  name: string;
  labels?: { [key: string]: string };
  data?: { [key: string]: string };
};

export const createConfigMap = async (configMap: ConfigMap): Promise<EngineData<V1ConfigMap>> => {
  try {
    console.log('configMap', configMap);
    console.log('name', `${parseName(configMap.name)}-cm`);

    const { response, body: configMapData } = await k8sCoreApi.createNamespacedConfigMap(
      configMap.namespace,
      {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: {
          name: `${parseName(configMap.name)}-cm`,
          labels: configMap.labels
        },
        data: configMap.data
      }
    );

    return {
      statusCode: response.statusCode || 200,
      data: configMapData
    };
  } catch (error) {
    console.log(error.body ? error.body.message : error.message);
    return {
      error: error.body ? error.body.message : error.message,
      statusCode: error.statusCode
    };
  }
};

export const getConfigMap = async (configMap: ConfigMap): Promise<EngineData<V1ConfigMap>> => {
  try {
    const { response, body: configMapData } = await k8sCoreApi.readNamespacedConfigMap(
      configMap.name,
      configMap.namespace
    );

    return {
      statusCode: response.statusCode || 200,
      data: configMapData
    };
  } catch (error) {
    console.log(error);
    return {
      error: error.body ? error.body.message : error.message,
      statusCode: error.statusCode
    };
  }
};

export const deleteConfigMap = async (configMap: ConfigMap): Promise<EngineData<V1ConfigMap>> => {
  try {
    const { response, body: configMapData } = await k8sCoreApi.deleteNamespacedConfigMap(
      configMap.name,
      configMap.namespace
    );

    return {
      statusCode: response.statusCode || 200,
      data: configMapData
    };
  } catch (error) {
    console.log(error);
    return {
      error: error.body ? error.body.message : error.message,
      statusCode: error.statusCode
    };
  }
};
