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
import { noAuthGuard } from './core/guards/no-auth.guard';
import { authGuard } from './core/guards/auth.guard';
import { AdminProductComponent } from './features/admin/product/product.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AdminUsersComponent } from './features/admin/users/users.component';
import { AdminCreateUserComponent } from './features/admin/users/create/create.component';
import { AdminNewProductComponent } from './features/admin/product/new/new-product.component';
import { AdminCategoriesComponent } from './features/admin/categories/categories.component';
import { AddCategoryComponent } from './features/admin/categories/add/add-category.component';
import { adminAuthGuard } from './core/guards/admin-auth.guard';
import { AuthCallbackComponent } from './features/auth/callback/callback.component';

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

            //Auth Routes
            {
                path: 'auth',
                component: AuthComponent,
                children: [
                    { path: 'login', component: LoginComponent },
                    { path: 'signup', component: SignupComponent },
                    { path: 'callback', component: AuthCallbackComponent },
                    { path: '', redirectTo: 'login', pathMatch: 'full' }, // optional default redirect
                ],
                canActivate: [noAuthGuard]
            },
        ]
    },
    {
        path: 'admin',
        canActivate: [adminAuthGuard],
        component: AdminLayoutComponent,
        children: [
            { path: '', component: AdminDashboardComponent },
            {
                path: 'products', children: [
                    { path: '', component: AdminProductComponent },
                    { path: 'add', component: AdminNewProductComponent }
                ]
            },
            {
                path: 'users', children: [
                    { path: '', component: AdminUsersComponent },
                    { path: 'create', component: AdminCreateUserComponent }
                ]
            },
            {
                path: 'categories', children: [
                    { path: '', component: AdminCategoriesComponent },
                    { path: 'add', component: AddCategoryComponent }
                ]
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
