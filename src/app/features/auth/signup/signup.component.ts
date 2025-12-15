import { Component, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { NotificationService } from "../../../core/services/notification.service";
import { LoggerService } from "../../../core/services/logger.service";

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './signup.component.html'
})
export class SignupComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private destroyRef = inject(DestroyRef);

    formType: "SIGNUP" | "OTP" = "SIGNUP";

    fullName = '';
    email = '';
    password = '';
    confirmPassword = '';
    agreeTerms = false;
    signupError: string | null = null;
    isSignupLoading = signal(false);
    isOtpLoading = signal(false);

    signup() {
        // Validate input
        if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
            this.signupError = 'Please fill in all fields';
            this.notification.warning('Please fill in all fields');
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.signupError = 'Passwords do not match';
            this.notification.error('Passwords do not match');
            return;
        }
        if (!this.agreeTerms) {
            this.signupError = 'You must agree to the Terms & Conditions';
            this.notification.warning('You must agree to the Terms & Conditions');
            return;
        }

        this.signupError = null;
        this.isSignupLoading.set(true);

        this.authService.signup({ email: this.email, password: this.password, name: this.fullName })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.isSignupLoading.set(false);
                    this.formType = "OTP";
                    this.notification.success('OTP sent to your email!');
                    this.logger.info('OTP sent successfully', { email: this.email });
                },
                error: (err) => {
                    this.isSignupLoading.set(false);
                    this.logger.error('Signup failed', err);

                    const errorMessage = err.error?.message || 'Signup failed. Please try again.';
                    this.signupError = errorMessage;
                    this.notification.error(errorMessage);
                }
            });
    }

    // OTP Management
    otp = Array(6).fill('');
    otpControls = new Array(6);

    onInput(event: any, index: number) {
        const input = event.target as HTMLInputElement;
        const otpInputs = document.querySelectorAll('#otpInput input') as NodeListOf<HTMLInputElement>;

        // Move focus forward only if a new value is typed (not backspace or delete)
        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    }

    onKeyDown(event: any, index: number) {
        if (event.key === 'Backspace') {
            const input = event.target as HTMLInputElement;
            const otpInputs = document.querySelectorAll('#otpInput input') as NodeListOf<HTMLInputElement>;

            // If current input has a value, just clear it — don't move yet
            if (input.value) {
                input.value = '';
                this.otp[index] = '';
                event.preventDefault();
                return;
            }

            // If empty and not the first, move back
            if (index > 0) {
                otpInputs[index - 1].focus();
            }
        }
    }

    submitOtp() {
        const otpValue = this.otp.join('');

        if (!otpValue || otpValue.length !== 6) {
            this.signupError = 'Please enter the complete 6-digit OTP';
            this.notification.warning('Please enter the complete 6-digit OTP');
            return;
        }

        this.signupError = null;
        this.isOtpLoading.set(true);

        this.authService.verifyRegistration({ email: this.email, otp: otpValue })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.isOtpLoading.set(false);
                    this.notification.success('Registration successful! Welcome to Lyvra!');
                    this.logger.info('Registration verified successfully', { email: this.email });
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.isOtpLoading.set(false);
                    this.logger.error('OTP verification failed', err);

                    const errorMessage = err.error?.message || 'Invalid OTP. Please try again.';
                    this.signupError = errorMessage;
                    this.notification.error(errorMessage);
                }
            });
    }
}