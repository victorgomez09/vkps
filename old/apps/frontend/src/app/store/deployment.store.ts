import { BehaviorSubject } from 'rxjs';
import { Deployment } from '../models/deployment.model';

export const $deployment: BehaviorSubject<Deployment> = new BehaviorSubject<Deployment>(
  {} as Deployment
);
