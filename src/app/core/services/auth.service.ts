import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, tap } from "rxjs";

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
    private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public user$: Observable<any> = this.userSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        // Check for existing token or user session (e.g., from localStorage)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.userSubject.next(JSON.parse(storedUser));
        }
    }

    login(credentials: { email: string, password: string }): Observable<Response> {
        return this.http.post<Response>('auth/login', credentials).pipe(
            tap((res) => {
                localStorage.setItem('user', JSON.stringify(res.user))
                localStorage.setItem('accessToken', res.token);
                this.userSubject.next(res.user)
            })
        )
    }

    signup(credentials: { email: string, password: string }): Observable<Response> {
        return this.http.post<Response>('auth/signup', credentials);
    }

    verifyRegistration(credentials: { email: string, otp: string }): Observable<Response> {
        return this.http.post<Response>('auth/register', credentials).pipe(
            tap((res) => {
                localStorage.setItem('user', JSON.stringify(res.user))
                localStorage.setItem('accessToken', res.token);
                this.userSubject.next(res.user)
            })
        )
    }

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        this.userSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        return !!this.userSubject.value;
    }

    getUser(): any {
        return this.userSubject.value;
    }
}