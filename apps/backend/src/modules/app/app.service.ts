import { Injectable, OnModuleInit } from '@nestjs/common';
import { execSync, spawn } from 'child_process';
import fs from 'fs';

import { InitService } from '../init/init.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private initService: InitService) {}

  async onModuleInit(): Promise<void> {
    await this.initService.checkAndInstallK8S();

    try {
      execSync('kubectl cluster-info');

      await this.initService.ceratePrivateDockerRegistry();
    } catch (error) {
      console.log('Kubernetes is not running');
    }
  }
}
