import { inject } from "@angular/core";
import { Router, CanActivateFn } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Guard to protect admin-only routes
 * Redirects to home if user is authenticated but not admin
 * Redirects to login if user is not authenticated
 */
export const adminAuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAdminAuthenticated()) {
        return true;
    }

    // If user is logged in but not admin, redirect to home
    if (authService.isAuthenticated()) {
        return router.createUrlTree(['/']);
    }

    // If not logged in, redirect to login
    return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });
};