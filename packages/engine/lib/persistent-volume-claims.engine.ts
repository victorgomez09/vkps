import { V1PersistentVolumeClaim } from '@kubernetes/client-node';

import { k8sCoreApi } from './utils.engine';
import { EngineData } from './types';

export type PersistentVolumeClaim = {
  namespace: string;
  name: string;
  labels: { [key: string]: string };
  accessModes: string[];
  storage: string;
};

export const createPersistentVolumeClaim = async (
  pvClaim: PersistentVolumeClaim
): Promise<EngineData<V1PersistentVolumeClaim>> => {
  try {
    const { response, body: pvClaimData } =
      await k8sCoreApi().createNamespacedPersistentVolumeClaim(pvClaim.namespace, {
        apiVersion: 'v1',
        kind: 'PersistentVolumeClaim',
        metadata: {
          name: pvClaim.name,
          labels: pvClaim.labels
        },
        spec: {
          storageClassName: `ls-${pvClaim.name}`,
          accessModes: pvClaim.accessModes,
          resources: {
            requests: {
              storage: pvClaim.storage
            }
          }
        }
      });

    return {
      statusCode: response.statusCode || 200,
      data: pvClaimData
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      error: error.body.message
    };
  }
};

export const getPersistentVolumeClaim = async (
  pvClaimName: string,
  namespace: string
): Promise<EngineData<V1PersistentVolumeClaim>> => {
  try {
    if (!(await k8sCoreApi().readNamespacedPersistentVolumeClaim(pvClaimName, namespace))) {
      return {
        statusCode: 500,
        error: 'PersistentVolumeClaim does not exist'
      };
    }

    return {
      statusCode: 200,
      data: (await k8sCoreApi().readNamespacedPersistentVolumeClaim(pvClaimName, namespace)).body
    };
  } catch (error) {
    return {
      statusCode: 500,
      error: (error as Error).message
    };
  }
};

export const deletePersistentVolumeClaim = async (pvClaim: PersistentVolumeClaim) => {
  try {
    if (
      !(await k8sCoreApi().readNamespacedPersistentVolumeClaim(pvClaim.name, pvClaim.namespace))
    ) {
      return {
        error: 'PersistentVolumeClaim does not exist'
      };
    }

    return await k8sCoreApi().deleteNamespacedPersistentVolumeClaim(
      pvClaim.name,
      pvClaim.namespace
    );
  } catch (error) {
    return {
      error: (error as Error).message
    };
  }
};
