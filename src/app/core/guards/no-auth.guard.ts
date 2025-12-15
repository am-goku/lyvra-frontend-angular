import { inject } from "@angular/core";
import { Router, CanActivateFn } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Guard to protect auth pages (login, signup) from authenticated users
 * Redirects to home if user is already authenticated
 */
export const noAuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    // Redirect authenticated users to home
    return router.createUrlTree(['/']);
};