import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layouts/user-layout.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductListComponent } from './features/products/product-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { ProductDetailComponent } from './features/product-detail/detail.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { AccountComponent } from './features/account/account.component';
import { AuthComponent } from './features/auth/auth.component';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
            { path: 'products', component: ProductListComponent },
            { path: 'products/:productId', component: ProductDetailComponent },
            { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
            { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },

            //Auth Routes
            {
                path: 'auth',
                component: AuthComponent,
                children: [
                    { path: 'login', component: LoginComponent },
                    { path: 'signup', component: SignupComponent },
                    { path: '', redirectTo: 'login', pathMatch: 'full' }, // optional default redirect
                ],
                canActivate: [NoAuthGuard]
            },
        ]
    },
    { path: '**', redirectTo: '' }
];
