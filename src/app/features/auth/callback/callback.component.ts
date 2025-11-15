import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthGoogleService } from '../../../core/oauth/oauth.service';

@Component({
    standalone: true,
    selector: 'app-auth-callback',
    template: `<p>Signing you in...</p>`
})
export class AuthCallbackComponent implements OnInit {

    constructor(
        private oauthService: AuthGoogleService,
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    async ngOnInit() {
        try {
            await this.oauthService.loginCodeFlow();
            const idToken = this.oauthService.idToken;

            if (!idToken) {
                console.error('Google login failed: No ID token');
                this.router.navigate(['/login'], { queryParams: { error: 'no_id_token' } });
                return;
            }

            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
            this.mockBackendLogin(idToken).subscribe({
                next: (res: any) => {
                    localStorage.setItem('access_token', res.access_token);
                    this.router.navigateByUrl(returnUrl);
                },
                error: (err) => {
                    console.error('Backend login failed', err);
                    this.router.navigate(['/login'], { queryParams: { error: 'backend_failure' } });
                },
            });
        } catch (error) {
            console.error('OAuth login failed', error);
            this.router.navigate(['/login'], { queryParams: { error: 'oauth_failure' } });
        }
    }

    // 🔥 FAKE BACKEND (remove when actual API ready)
    mockBackendLogin(idToken: string) {
        console.log('Sending ID token to backend:', idToken);

        // Return a fake response after 1 second
        return of({
            access_token: 'fake_jwt_123'
        }).pipe(delay(1000));
    }
}

