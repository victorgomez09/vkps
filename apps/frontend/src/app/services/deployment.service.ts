import { Injectable } from '@angular/core';

import { BaseService } from '../utils/service.util';
import { Deployment, DeploymentLogs, DeploymentRequest } from '../models/deployment.model';

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

  findById(id: string) {
    return this.get<Deployment>(`/${id}`);
  }

  findLogsById(id: string) {
    return this.get<DeploymentLogs>(`/${id}/logs`);
  }

  create(deployment: DeploymentRequest) {
    return this.post<DeploymentRequest, Deployment>('', deployment);
  }

  deploy(id: string) {
    return this.post<string, Deployment>(`/${id}/deploy`);
  }
}
