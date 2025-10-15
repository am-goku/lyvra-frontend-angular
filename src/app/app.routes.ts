import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layouts/user-layout.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductListComponent } from './features/products/product-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { ProductDetailComponent } from './features/product-detail/detail.component';
import { CheckoutComponent } from './features/checkout/checkout.component';

export const routes: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'cart', component: CartComponent },
            { path: 'products', component: ProductListComponent },
            { path: 'products/:productId', component: ProductDetailComponent },
            { path: 'checkout', component: CheckoutComponent },

            //Auth Routes
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent }
        ]
    },
    { path: '**', redirectTo: '' }
];
