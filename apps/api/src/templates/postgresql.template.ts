import { k8sCoreApi, k8sAppsApi } from '../utils/k8s.util';

export const createPostgresqlTemplate = async (
  name: string,
  database: string,
  user: string,
  password: string,
  volumeSize: number,
  replicas: number
) => {
  try {
    const configMap = await k8sCoreApi.createNamespacedConfigMap('default', {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: `${name}-cm`,
        labels: {
          app: name,
        },
      },
      data: {
        POSTGRES_DB: database,
        POSTGRES_USER: user,
        POSTGRES_PASSWORD: password,
      },
    });

    const persistenVolume = await k8sCoreApi.createPersistentVolume({
      apiVersion: 'v1',
      kind: 'PersistentVolume',
      metadata: {
        name: `${name}-pv`,
        labels: {
          app: name,
          type: 'local',
        },
      },
      spec: {
        storageClassName: `${name}-pv`,
        accessModes: ['ReadWriteMany'],
        capacity: {
          storage: `${volumeSize}Gi`,
        },
        hostPath: {
          path: '/mnt/data',
        },
      },
    });

    const persistenVolumeClaims = await k8sCoreApi.createNamespacedPersistentVolumeClaim('default', {
      apiVersion: 'v1',
      kind: 'PersistentVolumeClaim',
      metadata: {
        name: `${name}-pvc`,
        labels: {
          app: name,
        },
      },
      spec: {
        storageClassName: `${name}-pv`,
        accessModes: ['ReadWriteMany'],
        resources: {
          requests: {
            storage: `${volumeSize}Gi`,
          },
        },
      },
    });

    const deployment = await k8sAppsApi.createNamespacedDeployment('default', {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: name
      },
      spec: {
        replicas: replicas,
        selector: {
          matchLabels: {
            app: name
          }
        },
        template: {
          metadata: {
            labels: {
              app: name
            }
          },
          spec: {
            containers: [
              {
                name: name,
                image: 'postgres',
                imagePullPolicy: "IfNotPresent",
                ports: [
                  {
                    containerPort: 5432
                  }
                ],
                envFrom: [
                  {
                    configMapRef: {
                      name: configMap.body.metadata.name
                    }
                  }
                ],
                volumeMounts: [
                  {
                    mountPath: '/var/lib/postgresql/data',
                    name: name
                  }
                ]
              }
            ],
            volumes: [
              {
                name: name,
                persistentVolumeClaim: {
                  claimName: persistenVolumeClaims.body.metadata.name
                }
              }
            ]
          }
        }
      }
    })

    console.log('deployment: ', deployment.body.metadata.name);
  } catch (error) {
    console.log(error);
  }
};

