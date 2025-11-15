export const googleAuthConfig = {
  issuer: 'https://accounts.google.com',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userinfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
  loginUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  redirectUri: window.location.origin + '/auth/callback',
  clientId: '117997711868-8eo52qmrkv5diufv3nvnnus0ns0f4ou3.apps.googleusercontent.com',
  responseType: 'code',
  scope: 'openid email profile',
  strictDiscoveryDocumentValidation: false,
  showDebugInformation: true,
  // Ensure PKCE is enabled (default behavior, no need to set explicitly)
  usePkce: true, // Optional: explicitly enable PKCE
};