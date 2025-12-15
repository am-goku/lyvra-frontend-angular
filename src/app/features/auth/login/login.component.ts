import { Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { AuthGoogleService } from "../../../core/oauth/oauth.service";
import { NotificationService } from "../../../core/services/notification.service";
import { LoggerService } from "../../../core/services/logger.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private oauthService = inject(AuthGoogleService);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private destroyRef = inject(DestroyRef);

    emailOrPhone = '';
    password = '';
    rememberMe = false;
    loginError: string | null = null;
    isLoading = signal(false);

    login() {
        // Validate input
        if (!this.emailOrPhone || !this.password) {
            this.loginError = 'Please fill in all fields';
            this.notification.warning('Please fill in all fields');
            return;
        }

        this.loginError = null;
        this.isLoading.set(true);

        this.authService.login({ email: this.emailOrPhone, password: this.password })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.isLoading.set(false);
                    this.notification.success('Login successful!');

                    // Redirect based on role
                    if (res.user.role === "ADMIN") {
                        this.router.navigate(['/admin']);
                        return;
                    }

                    // Get returnUrl from query params or default to home
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigate([returnUrl]);
                },
                error: (err) => {
                    this.isLoading.set(false);
                    this.logger.error('Login failed', err);

                    // Show user-friendly error message
                    const errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
                    this.loginError = errorMessage;
                    this.notification.error(errorMessage);
                }
            });
    }

    googleLogin() {
        this.oauthService.login();
    }
}