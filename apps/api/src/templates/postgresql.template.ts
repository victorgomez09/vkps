// import {
//   createConfigMap,
//   createPersistentVolume,
//   createPersistentVolumeClaim,
// } from '@vkps/engine';

// export const createPostgresqlTemplate = async (
//   name: string,
//   database: string,
//   user: string,
//   password: string,
//   volumeSize: number,
//   replicas: number
// ) => {
//   try {
//     const configMap = await createConfigMap({
//       namespace: 'default',
//       name: `${name}-cm`,
//       labels: {
//         app: name,
//       },
//       data: {
//         POSTGRES_DB: database,
//         POSTGRES_USER: user,
//         POSTGRES_PASSWORD: password,
//       },
//     });

//     const persistentVolume = await createPersistentVolume({
//       namespace: 'default',
//       name: `${name}-pv`,
//       labels: {
//         app: name,
//         type: 'local',
//       },
//       accessModes: ['ReadWriteMany'],
//       storage: `${volumeSize}Gi`,
//       path: '/mnt/data',
//     });

//     const persistentVolumeClaims = await createPersistentVolumeClaim({
//       namespace: 'default',
//       name: `${name}-pvc`,
//       labels: {
//         app: name,
//       },
//       accessModes: ['ReadWriteMany'],
//       storage: `${volumeSize}Gi`,
//     });

//     // const deployment = await k8sAppsApi.createNamespacedDeployment('default', {
//     //   apiVersion: 'apps/v1',
//     //   kind: 'Deployment',
//     //   metadata: {
//     //     name: name,
//     //   },
//     //   spec: {
//     //     replicas: replicas,
//     //     selector: {
//     //       matchLabels: {
//     //         app: name,
//     //       },
//     //     },
//     //     template: {
//     //       metadata: {
//     //         labels: {
//     //           app: name,
//     //         },
//     //       },
//     //       spec: {
//     //         containers: [
//     //           {
//     //             name: name,
//     //             image: 'postgres',
//     //             imagePullPolicy: 'IfNotPresent',
//     //             ports: [
//     //               {
//     //                 containerPort: 5432,
//     //               },
//     //             ],
//     //             envFrom: [
//     //               {
//     //                 configMapRef: {
//     //                   name: configMap.body.metadata.name,
//     //                 },
//     //               },
//     //             ],
//     //             volumeMounts: [
//     //               {
//     //                 mountPath: '/var/lib/postgresql/data',
//     //                 name: name,
//     //               },
//     //             ],
//     //           },
//     //         ],
//     //         volumes: [
//     //           {
//     //             name: name,
//     //             persistentVolumeClaim: {
//     //               claimName: persistentVolumeClaims.body.metadata.name,
//     //             },
//     //           },
//     //         ],
//     //       },
//     //     },
//     //   },
//     // });

//     // const service = await k8sCoreApi.createNamespacedService('default', {
//     //   apiVersion: 'v1',
//     //   kind: 'Service',
//     //   metadata: {
//     //     name: name,
//     //   },
//     //   spec: {
//     //     type: 'NodePort',
//     //     ports: [
//     //       {
//     //         name: `port-${name}`,
//     //         port: 5432,
//     //         targetPort: 5432,
//     //       },
//     //     ],
//     //     selector: {
//     //       app: name,
//     //     },
//     //   },
//     // });

//     console.log('deployment: ', deployment.body.metadata.name);
//     return {
//       deployment: deployment.body.metadata.name,
//       service: service.body.spec.ports[0].nodePort,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// };
