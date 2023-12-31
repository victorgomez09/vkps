import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  V1ConfigMap,
  V1PersistentVolumeClaim,
  V1VolumeMount,
} from '@kubernetes/client-node';
import {
  LogLines,
  createClusterIpService,
  createConfigMap,
  createDeployment,
  createNodePortService,
  createPersistentVolume,
  createPersistentVolumeClaim,
  getDeploymentLogs,
  parseName,
} from 'engine';
import { K8S_NAMESPACE } from 'src/constants/global.constants';

import { DeploymentEnvService } from '../deployment-env/deployment-env.service';
import { DeploymentVolumeService } from '../deployment-volume/deployment-volume.service';

import { DeploymentRequestDto } from './deployment.dto';
import { Deployment } from './deployment.entity';

@Injectable()
export class DeploymentService {
  constructor(
    @InjectRepository(Deployment)
    private repository: EntityRepository<Deployment>,
    private em: EntityManager,
    private deploymentEnvService: DeploymentEnvService,
    private deploymentVolumeService: DeploymentVolumeService,
  ) {}

  async findById(id: string): Promise<Deployment | null> {
    return this.repository.findOne({ id });
  }

  async findByName(name: string): Promise<Deployment | null> {
    return this.repository.findOne({ name });
  }

  async findAll(): Promise<Deployment[]> {
    return this.repository.findAll();
  }

  async findLogsById(id: string): Promise<LogLines[]> {
    const deployment = await this.repository.findOne({ id });

    if (!deployment) {
      throw new NotFoundException('Deployment not found');
    }

    const { statusCode, data } = await getDeploymentLogs(
      parseName(deployment.deploymentId),
      K8S_NAMESPACE,
    );

    if (statusCode !== 200) {
      throw new InternalServerErrorException('Error getting logs');
    }

    return data;
  }

  async create(data: DeploymentRequestDto): Promise<Deployment> {
    const { name } = data;

    if (this.repository.findOne({ name: name })) {
      throw new ConflictException('Deployment already exists');
    }

    const deployment = this.repository.create({
      cpu: data.cpu,
      deploymentId: parseName(name),
      description: data.description,
      exposedNetwork: data.exposedNetwork,
      image: data.image,
      memory: data.memory,
      name: name,
      replicas: data.replicas,
      port: data.port,
    });

    await this.em.persistAndFlush(deployment);

    if (data.envs.length > 0) {
      data.envs.forEach(async (env) => {
        await this.deploymentEnvService.create({
          deploymentId: deployment.id,
          description: env.description,
          key: env.key,
          value: env.value,
        });
      });
    }

    if (data.volumes.length > 0) {
      data.volumes.forEach(async (volume) => {
        await this.deploymentVolumeService.create({
          deploymentId: deployment.id,
          path: volume.path,
          size: volume.size,
          accessMode: volume.accessMode,
          creationDate: new Date(),
          updateTime: new Date(),
        });
      });
    }

    return this.repository.findOne({ deploymentId: deployment.deploymentId });
  }

  async deploy(id: string): Promise<Deployment> {
    const deployment = await this.repository.findOne({ id });

    if (!deployment) {
      throw new NotFoundException('Deployment not found');
    }

    let configMap: V1ConfigMap;
    if (deployment.envs.length) {
      const env = {} as {
        [key: string]: string;
      };
      deployment.envs.map((deploymentEnv) => {
        env[deploymentEnv.key] = deploymentEnv.value;
      });
      const result = await createConfigMap({
        namespace: K8S_NAMESPACE,
        name: parseName(deployment.name),
        labels: {
          app: parseName(deployment.name),
        },
        data: env,
      });

      if (result.statusCode !== 201) {
        throw new InternalServerErrorException('Failed to create ConfigMap');
      }

      configMap = result.data;
    }

    let pvc: V1PersistentVolumeClaim;
    const volumeMounts: V1VolumeMount[] = [];

    if (deployment.volumes.length > 0) {
      for await (const volume of deployment.volumes) {
        const pvData = await createPersistentVolume({
          namespace: K8S_NAMESPACE,
          name: parseName(deployment.name),
          labels: {
            app: parseName(deployment.name),
          },
          accessModes: [volume.accessMode],
          storage: volume.size.toString(),
          path: volume.path,
        });

        if (pvData.statusCode !== 201) {
          throw new InternalServerErrorException(
            'Failed to create PersistentVolume',
          );
        }

        const pvcData = await createPersistentVolumeClaim({
          namespace: K8S_NAMESPACE,
          name: parseName(deployment.name),
          labels: {
            app: parseName(deployment.name),
          },
          accessModes: [volume.accessMode],
          storage: volume.size.toString(),
        });

        if (pvcData.statusCode !== 201) {
          throw new InternalServerErrorException(
            'Failed to create PersistentVolumeClaim',
          );
        }

        pvc = pvcData.data;

        volumeMounts.push({
          name: pvcData.data.metadata.name,
          mountPath: volume.path,
        });
      }
    }

    const object = {
      namespace: K8S_NAMESPACE,
      name: parseName(deployment.name),
      labels: {
        app: parseName(deployment.name),
      },
      image: deployment.image,
      replicas: deployment.replicas,
      memory: deployment.memory,
      cpu: deployment.cpu,
      port: deployment.port,
    };
    console.log('object', object);
    if (configMap) object['configMapRefName'] = configMap.metadata.name;
    if (pvc) object['persistentVolumeClaimRefName'] = pvc.metadata.name;
    if (volumeMounts.length > 0) object['volumeMounts'] = volumeMounts;

    const result = await createDeployment(object);

    console.log('result', result);

    if (deployment.exposedNetwork) {
      createNodePortService(deployment.deploymentId, K8S_NAMESPACE);
    } else {
      createClusterIpService(deployment.deploymentId, K8S_NAMESPACE);
    }

    return deployment;
  }

  async update(id: string, data: DeploymentRequestDto): Promise<Deployment> {
    if (this.repository.findOne({ id: id })) {
      throw new NotFoundException('Deployment not exists');
    }

    await this.repository.nativeUpdate(id, {
      cpu: data.cpu,
      description: data.description,
      exposedNetwork: data.exposedNetwork,
      image: data.image,
      memory: data.memory,
      name: data.name,
      replicas: data.replicas,
      port: data.port,
    });

    return this.repository.findOne({ id: id });
  }

  async delete(id: string): Promise<void> {
    await this.repository.nativeDelete({ id: id });
  }
}
