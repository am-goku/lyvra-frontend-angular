import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class ApiService {
    private baseUrl = 'http://localhost:3000'; // example

    constructor(private http: HttpClient) {};

    getUsers(): Observable<any>{
        return this.http.get(`${this.baseUrl}/users`)
    }

    getPosts(): Observable<any>{
        return this.http.get(`${this.baseUrl}/posts`)
    }
}