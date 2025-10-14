import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { LockIcon, LucideAngularModule, MailIcon, UserIcon } from "lucide-angular";
import { AuthService } from "../../../core/auth.service";

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [LucideAngularModule, ReactiveFormsModule, RouterLink, CommonModule],
    templateUrl: './signup.component.html'
})

export class SignupComponent {

    //Icons
    readonly UserIcon = UserIcon;
    readonly MailIcon = MailIcon;
    readonly LockIcon = LockIcon;

    signupForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        if (this.signupForm.valid) {
            const { name, email, password, confirmPassword } = this.signupForm.value;
            if (password !== confirmPassword) throw new Error("password does not match.");
            
            this.authService.signup(name!, email!, password!).subscribe({
                next: (res) => {
                    console.log("Signup Success:", res);
                    this.router.navigate(['/'])
                },
                error: (err) => console.log("Login failed:", err)
            });
        }
    }
};