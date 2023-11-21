import * as k8s from "@kubernetes/client-node";
import { V1ConfigMap } from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
export const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

export const listNamespacedPod = async (namespace: string) => {
  try {
    return await k8sCoreApi.listNamespacedPod(namespace);
  } catch (err) {
    console.error(err);
  }
};

export const createConfigMap = async (
  namespace: string,
  configMapName: string,
  data: { [key: string]: string; },
  labels: { [key: string]: string; },
) => {
  const configMap: V1ConfigMap = {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name: configMapName,
      labels: labels,
    },
    data: data,
  };

  return await k8sCoreApi.createNamespacedConfigMap(namespace, configMap);
}
