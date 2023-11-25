import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
export const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

export const parseName = (name: string) => {
  return name.replace(/\s/g, '-').toLowerCase();
};
