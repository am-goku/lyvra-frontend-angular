import { Component, DestroyRef, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { UserService } from "../../../../core/services/user.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { LoggerService } from "../../../../core/services/logger.service";
import { UserRole } from "../../../../models/user.model";
import { LucideAngularModule, ArrowLeftIcon } from "lucide-angular";

@Component({
    selector: 'admin-create-user',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
    templateUrl: './create.component.html',
})
export class AdminCreateUserComponent {
    private userService = inject(UserService);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    ArrowLeftIcon = ArrowLeftIcon;

    name = signal('');
    email = signal('');
    password = signal('');
    role = signal<UserRole>('USER');

    isLoading = signal(false);

    roles: { value: UserRole, label: string }[] = [
        { value: 'USER', label: 'User' },
        { value: 'ADMIN', label: 'Admin' }
    ];

    createUser() {
        if (!this.name() || !this.email() || !this.password()) {
            this.notification.warning('Please fill in all required fields');
            return;
        }

        this.isLoading.set(true);
        const userData = {
            name: this.name(),
            email: this.email(),
            password: this.password(),
            role: this.role()
        };

        this.userService.createUser(userData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.notification.success('User created successfully');
                    this.router.navigate(['/admin/users']);
                },
                error: (err) => {
                    this.logger.error('Failed to create user', err);
                    this.notification.error('Failed to create user. Email might be taken.');
                    this.isLoading.set(false);
                }
            });
    }
}