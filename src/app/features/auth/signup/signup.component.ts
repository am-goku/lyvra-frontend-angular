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

};