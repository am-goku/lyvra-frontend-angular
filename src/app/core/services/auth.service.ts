import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, tap, catchError, throwError } from "rxjs";
import { User, AuthResponse, LoginCredentials, SignupCredentials, VerifyOtpCredentials } from "../../models/user.model";
import { LoggerService } from "./logger.service";

@Injectable({ providedIn: "root" })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private logger = inject(LoggerService);

    private userSubject = new BehaviorSubject<User | null>(null);
    public user$ = this.userSubject.asObservable();

    constructor() {
        // Check for existing user session from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                this.userSubject.next(user);
                this.logger.info('User session restored', { userId: user.id });
            } catch (error) {
                this.logger.error('Failed to parse stored user', error);
                localStorage.removeItem('user');
            }
        }
    }

    /**
     * Login user with email and password
     */
    login(credentials: LoginCredentials): Observable<AuthResponse> {
        this.logger.debug('Attempting login', { email: credentials.email });

        return this.http.post<AuthResponse>('auth/login', credentials).pipe(
            tap((res) => {
                this.storeAuthData(res);
                this.logger.info('Login successful', { userId: res.user.id });
            }),
            catchError((error) => {
                this.logger.error('Login failed', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Step 1: Send OTP to email for registration
     */
    signup(credentials: SignupCredentials): Observable<{ message: string }> {
        this.logger.debug('Sending OTP for registration', { email: credentials.email });

        return this.http.post<{ message: string }>('auth/register/send-otp', { ...credentials, name: undefined }).pipe(
            tap(() => {
                this.logger.info('OTP sent successfully', { email: credentials.email });
            }),
            catchError((error) => {
                this.logger.error('Failed to send OTP', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Step 2: Verify OTP and complete registration
     */
    verifyRegistration(credentials: VerifyOtpCredentials): Observable<AuthResponse> {
        this.logger.debug('Verifying OTP', { email: credentials.email });

        return this.http.post<AuthResponse>('auth/register', credentials).pipe(
            tap((res) => {
                this.storeAuthData(res);
                this.logger.info('Registration verified successfully', { userId: res.user.id });
            }),
            catchError((error) => {
                this.logger.error('OTP verification failed', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Logout user and clear session
     */
    logout(): void {
        const userId = this.userSubject.value?.id;

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        this.userSubject.next(null);

        this.logger.info('User logged out', { userId });
        this.router.navigate(['/auth/login']);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.userSubject.value;
    }

    /**
     * Check if user is authenticated and has admin role
     */
    isAdminAuthenticated(): boolean {
        const user = this.userSubject.value;
        return !!user && user.role === 'ADMIN';
    }

    /**
     * Get current user
     */
    getUser(): User | null {
        return this.userSubject.value;
    }

    /**
     * Store authentication data in localStorage and update user subject
     */
    /**
     * Store authentication data in localStorage and update user subject
     * Handles cases where User object might be missing from response by decoding the token
     */
    private storeAuthData(response: AuthResponse): void {
        let user = response.user;

        // If user object is missing, try to decode from token
        if (!user && response.access_token) {
            this.logger.warn('User object missing in response, decoding token...');
            const payload = this.decodeToken(response.access_token);
            if (payload) {
                user = {
                    id: payload.sub || payload.id, // Handle 'sub' or 'id' claim
                    email: payload.email,
                    role: payload.role || 'USER',
                    name: payload.name
                };
                // Update response object for downstream subscribers
                response.user = user;
            }
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
        } else {
            this.logger.error('Failed to extract user from authentication response');
        }

        if (response.access_token) {
            localStorage.setItem('accessToken', response.access_token);
        }
    }

    /**
     * Decode JWT token payload
     */
    private decodeToken(token: string): any {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            this.logger.error('Failed to decode token', e);
            return null;
        }
    }
}