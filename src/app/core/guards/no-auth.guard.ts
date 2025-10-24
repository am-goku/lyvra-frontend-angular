import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: "root"
})
export class NoAuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router){};

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if(!this.authService.isAuthenticated()){
            return true
        } else {
            this.router.navigate(['/']);
            return false
        }
    }
}