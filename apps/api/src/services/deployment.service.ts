import { V1ConfigMap, V1PersistentVolumeClaim, V1VolumeMount, V1ContainerPort } from '@kubernetes/client-node'
import { createConfigMap, createPersistentVolume, createPersistentVolumeClaim, createDeployment, getDeployment, getPodsFromDeployment, Pod } from 'engine'

import { ApiResponse } from '../types';
import { prisma } from '../config/database.config';

export const deployTemplate = async ({
    templateName,
    namespace,
    deploymentName,
    version,
    replicas,
    env,
    volumes,
    ports
}: {
    templateName: string,
    namespace: string,
    deploymentName: string,
    version: string,
    replicas: number,
    env: { [key: string]: string },
    volumes: { path: string, size: string, accessMode: string[] }[],
    ports: V1ContainerPort[]
}): Promise<ApiResponse<{
    name: string,
    namespace: string,
    replicas: number
}>> => {
    const template = await prisma.template.findFirst({
        where: { name: templateName },
        include: {
            env: true,
            versions: true,
            volumes: true
        }
    })

    if (!template) {
        return {
            statusCode: 404,
            error: 'Template not found',
        };
    }

    let configMap: V1ConfigMap;
    if (template.env.length) {
        const result = await createConfigMap({
            namespace: namespace,
            name: deploymentName,
            labels: {
                app: deploymentName,
            },
            data: env,
        });

        if (result.statusCode !== 201) {
            return {
                statusCode: result.statusCode,
                error: result.error,
            };
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
                return {
                    statusCode: pvData.statusCode,
                    error: pvData.error,
                };
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
                return {
                    statusCode: pvcData.statusCode,
                    error: pvcData.error,
                };
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
        image: `${template.image}:${!version ? 'latest' : version}`,
        replicas: replicas,
        ports: ports,
        configMapRefName: configMap.metadata.name,
        persistentVolumeClaimRefName: pvc.metadata.name,
        volumeMounts,
    });

    return {
        statusCode: 200,
        data: {
            name: result.data.metadata.name,
            namespace: result.data.metadata.namespace,
            replicas: result.data.spec.replicas,
        }
    };
};

export const getTemplateDeployment = async (name: string, namespace: string): Promise<ApiResponse<{
    name: string,
    namespace: string,
    replicas: number,
    availableReplicas: number,
    pods: Pod[]
}>> => {
    try {
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

        return {
            statusCode: 200,
            data: {
                name: deployment.data.metadata.name,
                namespace: deployment.data.metadata.namespace,
                replicas: deployment.data.spec.replicas,
                availableReplicas: deployment.data.status.availableReplicas,
                pods: pods,
            }
        };
    } catch (error) {
        return {
            statusCode: error.statusCode,
            error: error.body.message,
        };
    }
};