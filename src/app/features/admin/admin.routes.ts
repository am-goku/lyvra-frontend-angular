import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { AdminProductComponent } from './product/product.component';
import { AdminNewProductComponent } from './product/new/new-product.component';
import { AdminUsersComponent } from './users/users.component';
import { AdminCreateUserComponent } from './users/create/create.component';
import { AdminCategoriesComponent } from './categories/categories.component';
import { AddCategoryComponent } from './categories/add/add-category.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: '', component: AdminDashboardComponent },
            {
                path: 'products', children: [
                    { path: '', component: AdminProductComponent },
                    { path: 'new', component: AdminNewProductComponent }
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
    }
];
