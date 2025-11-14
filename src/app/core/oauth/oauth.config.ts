import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    redirectUri: window.location.origin,
    clientId: '117997711868-8eo52qmrkv5diufv3nvnnus0ns0f4ou3.apps.googleusercontent.com',
    responseType: 'code',
    scope: 'openid profile email',
    showDebugInformation: true,
    strictDiscoveryDocumentValidation: false,
};

