import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layouts/user-layout.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductListComponent } from './features/products/product-list.component';
import { ProductDetailComponent } from './features/product-detail/detail.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { AccountComponent } from './features/account/account.component';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { authGuard } from './core/guards/auth.guard';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'cart', component: CartComponent, canActivate: [authGuard] },
            { path: 'products', component: ProductListComponent },
            { path: 'products/:productId', component: ProductDetailComponent },
            { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
            { path: 'account', component: AccountComponent, canActivate: [authGuard] },

            //Auth Routes (Lazy Loaded)
            {
                path: 'auth',
                canActivate: [noAuthGuard],
                loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
            },
        ]
    },
    // Admin Routes (Lazy Loaded)
    {
        path: 'admin',
        canActivate: [adminAuthGuard],
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    { path: '**', redirectTo: '' }
];
