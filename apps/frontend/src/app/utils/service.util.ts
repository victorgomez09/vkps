import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

type Options = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType: 'json';
  withCredentials?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
};

export class BaseService {
  private baseUrl: string;
  public httpClient: HttpClient = inject(HttpClient);

  constructor(private baseApi: string) {
    this.baseUrl = `${environment.apiUrl}/${this.baseApi}`;
  }

  public get<RESPONSE>(endpoint: string, options?: Options): Observable<RESPONSE> {
    console.log(this.baseUrl + endpoint);
    return this.httpClient.get<RESPONSE>(this.baseUrl + endpoint, options);
  }

  public post<REQUEST, RESPONSE>(
    endpoint: string,
    body?: REQUEST,
    options?: Options
  ): Observable<RESPONSE> {
    return this.httpClient.post<RESPONSE>(this.baseUrl + endpoint, body, options);
  }

  public put<REQUEST, RESPONSE>(
    endpoint: string,
    body?: REQUEST,
    options?: Options
  ): Observable<RESPONSE> {
    return this.httpClient.put<RESPONSE>(this.baseUrl + endpoint, body, options);
  }

  public delete<RESPONSE>(endpoint: string, options?: Options): Observable<RESPONSE> {
    return this.httpClient.delete<RESPONSE>(this.baseUrl + endpoint, options);
  }
}
