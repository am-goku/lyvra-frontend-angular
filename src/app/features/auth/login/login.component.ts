import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

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

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {};

    login() {
        // Placeholder logic
        if (!this.emailOrPhone || !this.password) {
            this.loginError = 'Please fill in all fields';
            return;
        }
        this.loginError = null;
        
        this.authService.login({email:this.emailOrPhone, password: this.password}).subscribe({
            next: (res) => {
                if(res.user.role === "ADMIN") {
                    this.router.navigate(['/admin/dashboard']);
                    return;
                }
                // Get returnUrl from query params or default to home
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigate([returnUrl]);
            },
            error: (err) => {
                console.log('Login Failed', err);
            }
        });
    }
};