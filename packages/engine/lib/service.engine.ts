import { V1Service } from '@kubernetes/client-node';
import { EngineData } from './types';
import { k8sAppsApi, k8sCoreApi } from './utils.engine';

export async function getServiceByName(
  name: string,
  namespace: string
): Promise<EngineData<V1Service>> {
  try {
    const { response, body: service } = await k8sCoreApi.readNamespacedService(name, namespace);
    if (response.statusCode !== 200) {
      return {
        statusCode: response.statusCode,
        error: 'Service not found'
      };
    }

    return {
      statusCode: response.statusCode || 200,
      data: service
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body ? error.body.message : error
    };
  }
}

export async function createClusterIpService(
  name: string,
  namespace: string
): Promise<EngineData<V1Service>> {
  try {
    const { response, body: deployment } = await k8sAppsApi.readNamespacedDeployment(
      name,
      namespace
    );
    if (response.statusCode !== 200) {
      return {
        statusCode: response.statusCode,
        error: 'Deployment not found'
      };
    }

    const data: V1Service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: `${name}-service`
      },
      spec: {
        selector: deployment.spec.selector.matchLabels,
        ports: [
          {
            name: 'http',
            port: deployment.spec.template.spec.containers[0].ports[0].hostPort,
            targetPort: deployment.spec.template.spec.containers[0].ports[0].containerPort
          }
        ]
      }
    };

    // const { body: service } = await k8sCoreApi.createNamespacedService(namespace, data);
    const { body: service } = await k8sCoreApi.replaceNamespacedService(
      `${name}-service`,
      namespace,
      data
    );

    return {
      statusCode: response.statusCode || 200,
      data: service
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body ? error.body.message : error
    };
  }
}

export async function createNodePortService(
  name: string,
  namespace: string
): Promise<EngineData<V1Service>> {
  try {
    const { response, body: deployment } = await k8sAppsApi.readNamespacedDeployment(
      name,
      namespace
    );
    if (response.statusCode !== 200) {
      return {
        statusCode: response.statusCode,
        error: 'Deployment not found'
      };
    }

    const data: V1Service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: `${name}-service`
      },
      spec: {
        selector: deployment.spec.selector.matchLabels,
        type: 'NodePort',
        ports: [
          {
            name: 'http',
            port: deployment.spec.template.spec.containers[0].ports[0].hostPort,
            targetPort: deployment.spec.template.spec.containers[0].ports[0].containerPort
          }
        ]
      }
    };

    const { body: service } = await k8sCoreApi.replaceNamespacedService(
      `${name}-service`,
      namespace,
      data
    );

    return {
      statusCode: response.statusCode || 200,
      data: service
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body ? error.body.message : error
    };
  }
}
