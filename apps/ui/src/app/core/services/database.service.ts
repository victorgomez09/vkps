import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Database } from '../../shared/types/database.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  /* GET METHODS */
  findAll(): Observable<Database[]> {
    return this.http.get<Database[]>(`${environment.API_URL}/databases`);
  }
}
