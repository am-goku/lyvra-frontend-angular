import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { authConfig } from './oauth.config';

@Injectable({
    providedIn: 'root',
})
export class AuthGoogleService {

    private configure() {
        this.oauthService.configure(authConfig);
        this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
            console.log('OAuth discovery document loaded');
        }).catch((error) => {
            console.error('Error loading discovery document:', error);
        });
    }

    constructor(
        private oauthService: OAuthService,
        private http: HttpClient
    ) {
        this.configure();
    }

    login() {
        this.oauthService.initCodeFlow();
    }

    getIdToken(): string {
        return this.oauthService.getIdToken();
    }

    getUserInfo(): Observable<any> {
        return this.http.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${this.oauthService.getAccessToken()}` },
        });
    }

    sendIdTokenToBackend(idToken: string): Observable<any> {
        return this.http.post('http://localhost:3000/auth/google', { idToken });
    }

    logout() {
        this.oauthService.logOut();
    }
}