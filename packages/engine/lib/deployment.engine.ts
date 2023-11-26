import { V1ContainerPort, V1Deployment, V1Status, V1VolumeMount } from '@kubernetes/client-node';

import { getPodLogs, getPodsFromDeployment } from './pod.engine';
import { EngineData } from './types';
import { k8sAppsApi } from './utils.engine';

export type Deployment = {
  namespace: string;
  name: string;
  labels: { [key: string]: string };
  image: string;
  replicas: number;

  ports: V1ContainerPort[];
  configMapRefName?: string;
  volumeMounts?: V1VolumeMount[];
  persistentVolumeClaimRefName?: string;
};

export const createDeployment = async (
  deployment: Deployment
): Promise<EngineData<V1Deployment>> => {
  try {
    const { response, body: deploymentData } = await k8sAppsApi.createNamespacedDeployment(
      deployment.namespace,
      {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: deployment.name,
          labels: deployment.labels
        },
        spec: {
          replicas: deployment.replicas,
          selector: {
            matchLabels: deployment.labels
          },
          template: {
            metadata: {
              labels: deployment.labels
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
                        name: deployment.configMapRefName
                      }
                    }
                  ],
                  volumeMounts: deployment.volumeMounts
                }
              ],
              volumes: [
                {
                  name: deployment.name,
                  persistentVolumeClaim: {
                    claimName: deployment.persistentVolumeClaimRefName
                  }
                }
              ]
            }
          }
        }
      }
    );

    return {
      statusCode: response.statusCode,
      data: deploymentData
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: error.statusCode,
      error: error.body.message
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
): Promise<EngineData<V1Deployment>> => {
  try {
    const { response, body: deploymentData } = await k8sAppsApi.readNamespacedDeployment(
      name,
      namespace,
      pretty,
      options
    );

    return {
      statusCode: response.statusCode,
      data: deploymentData
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body.message
    };
  }
};

export const getDeploymentLogs = async (
  deploymentName: string,
  podName: string = 'all',
  namespace: string = 'default'
): Promise<EngineData<string>> => {
  try {
    const logs: string[] = [];

    if (podName === 'all') {
      const { data } = await getPodsFromDeployment(deploymentName);

      if (!data) {
        return {
          statusCode: 404,
          error: 'Deployment not found'
        };
      }

      const logs: string[] = [];
      data.items.forEach(async (pod) => {
        const { statusCode, data } = await getPodLogs(pod.metadata.name, namespace);
        if (statusCode === 200) {
          logs.push(data);
        }
      });
    } else {
      const { statusCode, data } = await getPodLogs(podName, namespace);

      if (statusCode === 200) {
        logs.push(data);
      }
    }

    return {
      statusCode: 200,
      data: logs.join('\n')
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body.message
    };
  }
};

export const deleteDeployment = async (
  name: string,
  namespace: string
): Promise<EngineData<V1Status>> => {
  try {
    const { response, body } = await k8sAppsApi.deleteNamespacedDeployment(name, namespace);

    return {
      statusCode: response.statusCode,
      data: body
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body.message
    };
  }
};
