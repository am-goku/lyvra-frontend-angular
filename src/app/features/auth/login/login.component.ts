import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login.component.html',
})

export class LoginComponent {
    emailOrPhone = '';
    password = '';
    rememberMe = false;
    loginError: string | null = null;

    login() {
        // Placeholder logic
        if (!this.emailOrPhone || !this.password) {
            this.loginError = 'Please fill in all fields';
            return;
        }
        this.loginError = null;
        console.log('Logging in...', this.emailOrPhone);
    }


};