import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
    currentAction: string = 'default'; // Default state

    constructor(private router: Router) {
        // Subscribe to route changes
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.updateCurrentAction();
            }
        });
    }

    ngOnInit() {
        this.updateCurrentAction(); // Initial call
    }

    private updateCurrentAction() {
        const url = this.router.url;
        if (url === '/auth/signup') {
            this.currentAction = 'signup';
        } else if (url === '/auth/login') {
            this.currentAction = 'login';
        } else {
            this.currentAction = 'default';
        }
    }
};