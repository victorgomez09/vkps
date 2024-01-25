import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseService } from '../../core/utils/service.util';
import { Application } from '../../core/models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService extends BaseService {
  constructor() {
    super('applications');
  }

  public findAll(): Observable<Application[]> {
    return this.get('');
  }

  public findOne(id: string): Observable<Application> {
    return this.get(`/${id}`);
  }

  public create(data: Application): Observable<Application> {
    return this.post('', data);
  }
}
