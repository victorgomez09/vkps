import { V1PodList } from '@kubernetes/client-node';

import { k8sCoreApi } from './utils.engine';
import { EngineData } from './types';

export type Pod = {
  name: string;
  status: string;
  namespace: string;
  volumes?: {
    name: string;
    path: string;
  }[];
  env?: { [key: string]: string };
};

export const getPodsFromDeployment = async (
  deploymentName: string
): Promise<EngineData<V1PodList>> => {
  try {
    const { response, body: pods } = await k8sCoreApi().listPodForAllNamespaces(
      false,
      '',
      '',
      `app=${deploymentName}`
    );

    return {
      statusCode: response.statusCode || 200,
      data: pods
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body ? error.body : error.message
    };
  }
};

export const getPodLogs = async (
  pod: string,
  namespace: string = 'default'
): Promise<EngineData<string>> => {
  try {
    const { response, body } = await k8sCoreApi().readNamespacedPodLog(pod, namespace);

    return {
      statusCode: response.statusCode || 200,
      data: body
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body ? error.body : error.message
    };
  }
};
