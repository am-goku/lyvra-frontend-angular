                                                                                                                                                                     import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthGoogleService } from '../../../core/oauth/oauth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
    standalone: true,
    selector: 'app-auth-callback',
    template: `<p>Signing you in...</p>`
})
export class AuthCallbackComponent implements OnInit {
    private oauthService = inject(AuthGoogleService);
    private http = inject(HttpClient);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private destroyRef = inject(DestroyRef);

    async ngOnInit() {
        try {
            await this.oauthService.loginCodeFlow();
            const idToken = this.oauthService.idToken;

            if (!idToken) {
                this.logger.error('Google login failed: No ID token');
                this.notification.error('Google login failed. Please try again.');
                this.router.navigate(['/auth/login'], { queryParams: { error: 'no_id_token' } });
                return;
            }

            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
            this.mockBackendLogin(idToken)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (res: any) => {
                        localStorage.setItem('access_token', res.access_token);
                        this.notification.success('Login successful!');
                        this.router.navigateByUrl(returnUrl);
                    },
                    error: (err) => {
                        this.logger.error('Backend login failed', err);
                        this.notification.error('Login failed. Please try again.');
                        this.router.navigate(['/auth/login'], { queryParams: { error: 'backend_failure' } });
                    },
                });
        } catch (error) {
            this.logger.error('OAuth login failed', error);
            this.notification.error('OAuth login failed. Please try again.');
            this.router.navigate(['/auth/login'], { queryParams: { error: 'oauth_failure' } });
        }
    }

    // 🔥 FAKE BACKEND (remove when actual API ready)
    mockBackendLogin(idToken: string) {
        this.logger.debug('Sending ID token to backend', { idToken });

        // Return a fake response after 1 second
        return of({
            access_token: 'fake_jwt_123'
        }).pipe(delay(1000));
    }
}

