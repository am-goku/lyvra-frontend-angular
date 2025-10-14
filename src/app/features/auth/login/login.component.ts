import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterLink } from "@angular/router";
import { LockIcon, LucideAngularModule, MailIcon } from "lucide-angular";
import { AuthService } from "../../../core/auth.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [LucideAngularModule, ReactiveFormsModule, RouterLink, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})

export class LoginComponent {
    //Icons
    readonly LockIcon = LockIcon;
    readonly MailIcon = MailIcon;

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required)
    })

    constructor(private readonly authService: AuthService, private router: Router) { };

    onSubmit() {
        if (this.loginForm.valid) {

            const { email, password } = this.loginForm.value;

            this.authService.login(email!, password!).subscribe({
                next: (res) => {
                    console.log("Login Success:", res);
                    this.router.navigate(['/'])
                },
                error: (err) => console.log("Login failed:", err)
            });
        }
    }
};