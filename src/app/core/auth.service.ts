import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

export interface Response {
    token: string;
    user: {
        id: number;
        name?: string;
        email: string;
    }
}

@Injectable({ providedIn: "root" })
export class AuthService {
    user = signal<Response['user'] | null>(null);

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<Response> {
        return this.http.post<Response>('auth/login', { email, password }).pipe(
            tap((res) => {
                localStorage.setItem('accessToken', res.token);
                this.user.set(res?.user);
            })
        )
    }

    signup(name: string, email: string, password: string): Observable<Response> {
        return this.http.post<Response>('auth/register', { email, password }).pipe(
            tap((res) => {
                localStorage.setItem('accessToken', res.token);
                this.user.set(res.user)
            })
        )
    }

    logout() {
        localStorage.removeItem('accessToken')
        this.user.set(null);
    }

    isLoggedIn() {
        return this.user() !== null;
    }
}