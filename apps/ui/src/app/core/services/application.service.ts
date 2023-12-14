import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { Application } from "../../shared/types/application.type";

@Injectable({
    providedIn: "root"
})
export class ApplicationService {

    constructor(private http: HttpClient) { }

    findAll(): Observable<Application[]> {
        return this.http.get<Application[]>(`${environment.API_URL}/applications`);
    }
}