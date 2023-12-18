import {
  V1ContainerPort,
  V1Deployment,
  V1Pod,
  V1Status,
  V1VolumeMount
} from '@kubernetes/client-node';
import * as stream from 'stream';

import { getPodsFromDeployment } from './pod.engine';
import { EngineData, LogLines } from './types';
import { k8sAppsApi, k8sLogsApi, logcolor } from './utils.engine';

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

export type DeploymentResponse = V1Deployment & {
  pods: V1Pod[];
};

export const createDeployment = async (
  deployment: Deployment
): Promise<EngineData<V1Deployment>> => {
  try {
    const object = {
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
                ports: deployment.ports
              }
            ]
          }
        }
      }
    };
    if (deployment.configMapRefName) {
      object.spec.template.spec.containers[0]['envFrom'] = [
        {
          configMapRef: {
            name: deployment.configMapRefName || ''
          }
        }
      ];
    }
    if (deployment.volumeMounts) {
      object.spec.template.spec.containers[0]['volumeMounts'] = deployment.volumeMounts;
    }
    if (deployment.persistentVolumeClaimRefName) {
      object.spec.template.spec['volumes'] = [
        {
          name: deployment.name,
          persistentVolumeClaim: {
            claimName: deployment.persistentVolumeClaimRefName || ''
          }
        }
      ];
    }

    const { response, body: deploymentData } = await k8sAppsApi.createNamespacedDeployment(
      deployment.namespace,
      object
    );

    return {
      statusCode: response.statusCode || 200,
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
): Promise<EngineData<DeploymentResponse>> => {
  try {
    const { response, body: deploymentData } = await k8sAppsApi.readNamespacedDeployment(
      name,
      namespace,
      pretty,
      options
    );

    const { data: pods } = await getPodsFromDeployment(name);

    const object = { ...deploymentData, pods: pods.items };

    return {
      statusCode: response.statusCode || 200,
      data: object
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body ? error.body.message : error
    };
  }
};

export const getDeploymentLogs = async (
  deploymentName: string,
  namespace: string = 'default'
): Promise<EngineData<LogLines[]>> => {
  try {
    const loglines: LogLines[] = [];

    let logs: string = '';
    const logStream = new stream.PassThrough();
    logStream.on('data', (chunk: any) => {
      logs += chunk.toString();
    });

    const { body } = await k8sAppsApi.readNamespacedDeployment(deploymentName, namespace);

    const { data } = await getPodsFromDeployment(deploymentName);

    if (!data) {
      return {
        statusCode: 404,
        error: 'Deployment not found'
      };
    }

    for await (const pod of data.items) {
      await k8sLogsApi.log(
        namespace,
        pod.metadata?.name || '',
        pod.spec?.containers[0]?.name || '',
        logStream,
        { follow: false, tailLines: 80, pretty: false, timestamps: true }
      );

      // sleep for 1 second to wait for all logs to be collected
      await new Promise((r) => setTimeout(r, 300));

      // split loglines into array
      const loglinesArray = logs.split('\n').reverse();
      for (const logline of loglinesArray) {
        if (logline.length > 0) {
          // split after first whitespace
          const loglineArray = logline.split(/(?<=^\S+)\s/);
          const loglineDate = new Date(loglineArray[0]);
          const loglineText = loglineArray[1];

          loglines.push({
            id: '',
            time: loglineDate.getTime(),
            app: body.metadata?.name || '',
            pod: pod.metadata?.name || '',
            podID:
              pod.metadata?.name || ''.split('-')[3] + '-' + pod.metadata?.name || ''.split('-')[4],
            container: pod.spec?.containers[0]?.name || '',
            color: logcolor(pod.metadata?.name || ''),
            log: loglineText
          });
        }
      }
    }

    return {
      statusCode: 200,
      data: loglines
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: error.statusCode,
      error: error.body ? error.body.message : error
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
      statusCode: response.statusCode || 200,
      data: body
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body.message
    };
  }
};
