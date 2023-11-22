import {
    V1ConfigMap,
    V1PersistentVolumeClaim,
    V1VolumeMount,
} from '@kubernetes/client-node';
import { Request, Response } from 'express';

import { Pod } from '../models/engine.model';
import { templates } from '../templates/data.template';
import {
    createConfigMap,
    createDeployment,
    createPersistentVolume,
    createPersistentVolumeClaim,
    getDeployment,
    getPodsFromDeployment,
} from '../utils/k8s.util';

export const deployApplication = async (req: Request, res: Response) => {
    const { name } = req.params;
    const {
        namespace,
        name: deploymentName,
        replicas,
        env,
        volumes,
        ports,
    } = req.body;

    const template = templates.find((t) => t.name === name);

    if (!template) {
        return res.status(404).json({
            error: 'Template not found',
        });
    }

    let configMap: V1ConfigMap;
    if (template.env) {
        const result = await createConfigMap({
            namespace: namespace,
            name: deploymentName,
            labels: {
                app: deploymentName,
            },
            data: env,
        });

        if (result.statusCode !== 201) {
            return res.status(result.statusCode).json({
                error: result.error,
            });
        }

        configMap = result.data;
    }

    let pvc: V1PersistentVolumeClaim;
    const volumeMounts: V1VolumeMount[] = [];
    if (volumes.length > 0) {
        for await (const volume of volumes) {
            const pvData = await createPersistentVolume({
                namespace: namespace,
                name: deploymentName,
                labels: {
                    app: deploymentName,
                },
                accessModes: volume.accessMode || ['ReadWriteOnce'],
                storage: volume.size,
                path: volume.path,
            });
            if (pvData.statusCode !== 201) {
                return res.status(pvData.statusCode).json({
                    error: pvData.error,
                });
            }
            console.log('pvData', pvData.data.metadata.name);

            const pvcData = await createPersistentVolumeClaim({
                namespace: namespace,
                name: deploymentName,
                labels: {
                    app: deploymentName,
                },
                accessModes: volume.accessMode || ['ReadWriteOnce'],
                storage: volume.size,
            });
            if (pvcData.statusCode !== 201) {
                return res.status(pvcData.statusCode).json({
                    error: pvcData.error,
                });
            }
            pvc = pvcData.data;

            volumeMounts.push({
                name: pvcData.data.metadata.name,
                mountPath: volume.path,
            });
        }
    }

    const result = await createDeployment({
        namespace: namespace,
        name: deploymentName,
        labels: {
            app: deploymentName,
        },
        image: template.image,
        replicas: replicas,
        ports: ports,
        configMapRefName: configMap.metadata.name,
        persistentVolumeClaimRefName: pvc.metadata.name,
        volumeMounts,
    });

    res.json({
        data: {
            name: result.data.metadata.name,
            namespace: result.data.metadata.namespace,
            replicas: result.data.spec.replicas,
        },
    });
};

export const getApplicationDeployment = async (req: Request, res: Response) => {
    try {
        const { name, namespace } = req.query;

        const deployment = await getDeployment(String(name), String(namespace));

        const pods: Pod[] = [];
        const podsData = await getPodsFromDeployment(String(name));
        if (podsData.statusCode !== 200) {
            return {
                statusCode: podsData.statusCode,
                error: podsData.error,
            };
        }

        console.log('podsData', podsData.data.items[0].spec.volumes);
        podsData.data.items.forEach((pod) => {
            pods.push({
                name: pod.metadata.name,
                status: pod.status.phase,
                namespace: pod.metadata.namespace,
            });
        });

        res.json({
            data: {
                name: deployment.data.metadata.name,
                namespace: deployment.data.metadata.namespace,
                replicas: deployment.data.spec.replicas,
                availableReplicas: deployment.data.status.availableReplicas,
                pods: pods,
            },
        });
    } catch (error) {
        return {
            statusCode: error.statusCode,
            error: error.body.message,
        };
    }
};
