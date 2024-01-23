import { Injectable } from '@angular/core';
import { BaseService } from '../../core/utils/service.util';
import { Addon } from '../../core/models/addon.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddonService extends BaseService {
  constructor() {
    super('addons');
  }

  findAll(): Observable<Addon[]> {
    return this.get('');
  }

  findByName(name: string): Observable<Addon> {
    return this.get(`/findByName/${name}`);
  }
}
