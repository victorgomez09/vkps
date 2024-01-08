import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

let _k8sCoreApi: k8s.CoreV1Api;
let _k8sAppsApi: k8s.AppsV1Api;

export const k8sCoreApi = () => {
  if (_k8sCoreApi === null || _k8sCoreApi === undefined)
    _k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);

  return _k8sCoreApi;
};
export const k8sAppsApi = () => {
  if (_k8sAppsApi === null || _k8sAppsApi === undefined)
    _k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

  return _k8sAppsApi;
};
export const k8sLogsApi = new k8s.Log(kc);

export const parseName = (name: string) => {
  return name.replace(/\s/g, '-').toLowerCase();
};

export const logcolor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substring(2);
  }
  return color;
};
