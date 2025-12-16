import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthCallbackComponent } from './callback/callback.component';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
            { path: 'callback', component: AuthCallbackComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' },
        ]
    }
];
