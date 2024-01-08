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
  V1Pod,
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
  getDeployment,
  getDeploymentLogs,
  parseName,
} from 'engine';
import { GIT_PATH, K8S_NAMESPACE } from 'src/constants/global.constants';

import { DeploymentEnvService } from '../deployment-env/deployment-env.service';
import { DeploymentVolumeService } from '../deployment-volume/deployment-volume.service';

import { DeploymentRequestDto } from './deployment.dto';
import { Deployment } from './deployment.entity';
import { BuildpackService } from '../buildpack/buildpack.service';
import { executeCommand } from 'src/shared/utils/exec.util';

type DeploymentResponse = Deployment & {
  workingReplicas: number;
  totalReplicas: number;
  pods: V1Pod[];
  status?: string;
  namespace?: string;
  // service?: Service;
};

@Injectable()
export class DeploymentService {
  constructor(
    @InjectRepository(Deployment)
    private repository: EntityRepository<Deployment>,
    private em: EntityManager,
    private deploymentEnvService: DeploymentEnvService,
    private deploymentVolumeService: DeploymentVolumeService,
    private buildpackService: BuildpackService,
  ) {}

  async findById(id: string): Promise<DeploymentResponse> {
    const deployment = await this.repository.findOne(
      { id },
      {
        populate: ['envs', 'volumes'],
      },
    );

    if (!deployment) {
      throw new NotFoundException('Deployment not found');
    }

    const k8sDeployment = await getDeployment(
      deployment.deploymentId,
      K8S_NAMESPACE,
    );

    if (k8sDeployment.statusCode !== 200 || !k8sDeployment.data) {
      return {
        ...deployment,
        workingReplicas: 0,
        totalReplicas: 0,
        pods: [],
      };
    }

    return {
      ...deployment,
      workingReplicas: k8sDeployment.data.status?.availableReplicas || 0,
      totalReplicas: k8sDeployment.data.status?.replicas || 0,
      pods: k8sDeployment.data?.pods || [],
    };
  }

  async findByName(name: string): Promise<Deployment> {
    return this.repository.findOne(
      { name },
      {
        populate: ['envs', 'volumes'],
      },
    );
  }

  async findAll(): Promise<DeploymentResponse[]> {
    const result: DeploymentResponse[] = [];

    const deployments = await this.repository.findAll({
      orderBy: { creationDate: 'DESC' },
      populate: ['envs', 'volumes'],
    });

    for await (const deployment of deployments) {
      const k8sDeployment = await getDeployment(
        deployment.deploymentId,
        K8S_NAMESPACE,
      );

      if (k8sDeployment.statusCode !== 200 || !k8sDeployment.data) {
        result.push({
          ...deployment,
          workingReplicas: 0,
          totalReplicas: 0,
          pods: [],
        });
        continue;
      }

      result.push({
        ...deployment,
        workingReplicas: k8sDeployment.data.status?.availableReplicas || 0,
        totalReplicas: k8sDeployment.data.status?.replicas || 0,
        pods: k8sDeployment.data.pods || [],
        status:
          k8sDeployment.data.status?.availableReplicas > 0
            ? 'Running'
            : 'Stopped',
        namespace: k8sDeployment.data.metadata.namespace,
      });
    }

    return result;
  }

  async findLogsById(id: string): Promise<LogLines[]> {
    const deployment = await this.repository.findOne(
      { id },
      {
        populate: ['envs', 'volumes'],
      },
    );

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

    if (await this.repository.findOne({ name: name })) {
      throw new ConflictException('Deployment already exists');
    }

    let buildpack: string;
    if (data.repositoryUrl) {
      executeCommand(`git clone ${data.repositoryUrl} ${data.name}`, GIT_PATH);
      buildpack = await this.buildpackService.selectBuildPack(
        `${GIT_PATH}/${data.name}`,
      );
    }

    const deployment = this.repository.create({
      cpu: data.cpu,
      deploymentId: parseName(name),
      description: data.description,
      exposedNetwork: data.exposedNetwork,
      repositoryUrl: data.repositoryUrl,
      buildpack: buildpack,
      image: data.image,
      memory: data.memory,
      name: name,
      replicas: data.replicas,
      port: data.port,
    });

    await this.em.persistAndFlush(deployment);
    const result = await this.repository.findOne({
      deploymentId: deployment.deploymentId,
    });

    if (data.envs.length > 0) {
      data.envs.forEach(async (env) => {
        await this.deploymentEnvService.create({
          deploymentId: result.id,
          description: env.description,
          key: env.key,
          value: env.value,
        });
      });
    }

    if (data.volumes.length > 0) {
      data.volumes.forEach(async (volume) => {
        await this.deploymentVolumeService.create({
          deploymentId: result.id,
          path: volume.path,
          size: volume.size,
          accessMode: volume.accessMode,
          creationDate: new Date(),
          updateTime: new Date(),
        });
      });
    }

    return result;
  }

  async deploy(id: string): Promise<Deployment> {
    const deployment = await this.repository.findOne(
      { id },
      {
        populate: ['envs', 'volumes'],
      },
    );

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

    if (configMap) object['configMapRefName'] = configMap.metadata.name;
    if (pvc) object['persistentVolumeClaimRefName'] = pvc.metadata.name;
    if (volumeMounts.length > 0) object['volumeMounts'] = volumeMounts;

    const result = await createDeployment(object);

    console.log('result', result);

    if (deployment.exposedNetwork) {
      createNodePortService(
        deployment.deploymentId,
        deployment.port,
        K8S_NAMESPACE,
      );
    } else {
      createClusterIpService(
        deployment.deploymentId,
        deployment.port,
        K8S_NAMESPACE,
      );
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
