import { Injectable } from '@angular/core';

import { BaseService } from '../utils/service.util';
import { Deployment, DeploymentRequest } from '../models/deployment.model';

@Injectable({
  providedIn: 'root'
})
export class DeploymentService extends BaseService {
  constructor() {
    super('deployments');
  }

  findAll() {
    return this.get<Deployment[]>('');
  }

  create(deployment: DeploymentRequest) {
    return this.post<DeploymentRequest, Deployment>('', deployment);
  }
}
