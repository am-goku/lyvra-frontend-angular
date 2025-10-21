import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './signup.component.html'
})

export class SignupComponent {

    formType: "SIGNUP" | "OTP" = "SIGNUP";

    fullName = '';
    email = '';
    password = '';
    confirmPassword = '';
    agreeTerms = false;
    signupError: string | null = null;

    signup() {
        if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
            this.signupError = 'Please fill in all fields';
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.signupError = 'Passwords do not match';
            return;
        }
        if (!this.agreeTerms) {
            this.signupError = 'You must agree to the Terms & Conditions';
            return;
        }
        this.signupError = null;
        console.log('Signing up...', this.email);
    }


    //OTP Management
    otp = Array(6).fill('');
    otpControls = new Array(6);

    onInput(event: any, index: number) {
        console.log('Triggering input')
        const input = event.target as HTMLInputElement;
        const otpInputs = document.querySelectorAll('#otpInput input') as NodeListOf<HTMLInputElement>;

        // move focus forward only if a new value is typed (not backspace or delete)
        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    }

    onKeyDown(event: any, index: number) {
        console.log('logging', event)
        if (event.key === 'Backspace') {
            const input = event.target as HTMLInputElement;
            const otpInputs = document.querySelectorAll('#otpInput input') as NodeListOf<HTMLInputElement>;
            // if current input has a value, just clear it — don't move yet
            if (input.value) {
                input.value = '';
                this.otp[index] = '';
                event.preventDefault();
                return;
            }

            // if empty and not the first, move back
            if (index > 0) {
                otpInputs[index - 1].focus();
            }
        }
    }

    submitOtp() {
        console.log(`OTP: ${this.otp.join('')}`);
    }

};