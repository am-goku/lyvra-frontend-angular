import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { googleAuthConfig } from './oauth.config';

@Injectable({ providedIn: 'root' })
export class AuthGoogleService {

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(googleAuthConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initCodeFlow(); // Start Google OAuth Redirect
  }

  logout() {
    this.oauthService.logOut();
  }

  get profile() {
    return this.oauthService.getIdentityClaims();
  }

  get idToken(): string | null {
    return this.oauthService.getIdToken();
  }

  async loginCodeFlow() {
    await this.oauthService.tryLoginCodeFlow();
  }
  
}
