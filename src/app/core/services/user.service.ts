import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, tap, throwError } from "rxjs";
import { User } from "../../models/user.model";
import { LoggerService } from "./logger.service";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private http = inject(HttpClient);
    private logger = inject(LoggerService);

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('users').pipe(
            tap(users => this.logger.debug('Users fetched', { count: users.length })),
            catchError(err => {
                this.logger.error('Failed to fetch users', err);
                return throwError(() => err);
            })
        );
    }

    createUser(userData: any): Observable<User> {
        return this.http.post<User>('users', userData).pipe(
            tap(user => this.logger.info('User created', { id: user.id })),
            catchError(err => {
                this.logger.error('Failed to create user', err);
                return throwError(() => err);
            })
        );
    }

    updateUser(id: number, userData: Partial<User>): Observable<User> {
        return this.http.patch<User>(`users/${id}`, userData).pipe(
            tap(() => this.logger.info('User updated', { id })),
            catchError(err => {
                this.logger.error('Failed to update user', err);
                return throwError(() => err);
            })
        );
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`users/${id}`).pipe(
            tap(() => this.logger.info('User deleted', { id })),
            catchError(err => {
                this.logger.error('Failed to delete user', err);
                return throwError(() => err);
            })
        );
    }
}
