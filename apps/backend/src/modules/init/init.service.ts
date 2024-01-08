import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppConfigurationService } from '../app-configuration/app-configuration.service';
import {
  getPersistentVolume,
  parseName,
  createPersistentVolume,
  getPersistentVolumeClaim,
  createPersistentVolumeClaim,
  getDeployment,
  createDeployment,
  getServiceByName,
  createNodePortService,
} from 'engine';
import { K8S_NAMESPACE } from 'src/constants/global.constants';
import { execSync, spawn } from 'child_process';

@Injectable()
export class InitService {
  constructor(private appConfigService: AppConfigurationService) {}

  async checkAndInstallK8S(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        execSync('kubectl cluster-info');
      } catch (error) {
        const ls = spawn('sudo snap install microk8s --classic', {
          shell: true,
        });

        ls.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });

        ls.on('error', (error) => {
          reject(error);
        });

        ls.on('close', () => {
          resolve();
        });
      }
    });
  }

  async ceratePrivateDockerRegistry() {
    const PRIVATE_DOCKER_REGISTRY = 'Private docker registry';

    let persistentVolumeClaimName: string;
    const readPv = await getPersistentVolume(
      parseName(PRIVATE_DOCKER_REGISTRY),
    );
    if (!readPv.data) {
      const pvData = await createPersistentVolume({
        namespace: K8S_NAMESPACE,
        name: parseName(PRIVATE_DOCKER_REGISTRY),
        labels: {
          app: parseName(PRIVATE_DOCKER_REGISTRY),
        },
        accessModes: ['ReadWriteOnce'],
        storage: '10Gi',
        path: '/var/lib/registry',
      });

      if (pvData.statusCode !== 201 && pvData.statusCode !== 409) {
        throw new InternalServerErrorException(
          'Failed to create PersistentVolume',
        );
      }
    }

    const readPvc = await getPersistentVolumeClaim(
      parseName(PRIVATE_DOCKER_REGISTRY),
      K8S_NAMESPACE,
    );

    if (!readPvc.data) {
      const pvcData = await createPersistentVolumeClaim({
        namespace: K8S_NAMESPACE,
        name: parseName(PRIVATE_DOCKER_REGISTRY),
        labels: {
          app: parseName(PRIVATE_DOCKER_REGISTRY),
        },
        accessModes: ['ReadWriteOnce'],
        storage: '10Gi',
      });

      if (pvcData.statusCode !== 201 && pvcData.statusCode !== 409) {
        throw new InternalServerErrorException(
          'Failed to create PersistentVolumeClaim',
        );
      }

      persistentVolumeClaimName = pvcData.data.metadata.name;
    } else {
      console.log('test', readPvc.data.metadata.name);
      persistentVolumeClaimName = readPvc.data.metadata.name;
    }

    const object = {
      namespace: K8S_NAMESPACE,
      name: parseName(PRIVATE_DOCKER_REGISTRY),
      labels: {
        app: parseName(PRIVATE_DOCKER_REGISTRY),
      },
      image: 'registry',
      replicas: 1,
      port: 5000,
      memory: '512Mi',
      cpu: '1000m',
      persistentVolumeClaimRefName: persistentVolumeClaimName,
    };

    const readDeployment = await getDeployment(
      parseName(PRIVATE_DOCKER_REGISTRY),
      K8S_NAMESPACE,
    );
    if (!readDeployment.data) {
      await createDeployment(object);
    }

    const readService = await getServiceByName(
      `${parseName(PRIVATE_DOCKER_REGISTRY)}-service`,
      K8S_NAMESPACE,
    );

    if (!readService.data) {
      const service = await createNodePortService(
        parseName(PRIVATE_DOCKER_REGISTRY),
        5000,
        K8S_NAMESPACE,
      );

      if (!(await this.appConfigService.find())) {
        this.appConfigService.create({
          dockerRegistryPort: service.data.spec.ports[0].nodePort,
        });
      } else {
        this.appConfigService.update({
          dockerRegistryPort: service.data.spec.ports[0].nodePort,
        });
      }
    }

    if (!(await this.appConfigService.find())) {
      this.appConfigService.create({
        dockerRegistryPort: readService.data.spec.ports[0].nodePort,
      });
    } else {
      this.appConfigService.update({
        dockerRegistryPort: readService.data.spec.ports[0].nodePort,
      });
    }
  }
}
