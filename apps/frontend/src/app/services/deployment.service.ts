import { Injectable } from '@angular/core';

import { BaseService } from '../utils/service.util';
import { Deployment } from '../models/deployment.model';

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
}
