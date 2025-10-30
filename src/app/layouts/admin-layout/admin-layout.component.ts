import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { ChevronRightIcon, HeadphonesIcon, HouseIcon, LucideAngularModule, MenuIcon, PackageIcon, ShoppingCartIcon, UsersIcon, X } from "lucide-angular";

interface NavItem {
    label: string;
    route: string;
    icon: any;
    tabs?: Tab[];
}

interface Tab {
    label: string;
    route: string;
}

@Component({
    selector: "app-admin-layout",
    standalone: true,
    templateUrl: "./admin-layout.component.html",
    styleUrls: ["./admin-layout.component.scss"],
    imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, LucideAngularModule],
})
export class AdminLayoutComponent {
    sidebarOpen = signal(false);

    icons = {
        menu: MenuIcon,
        x: X,
        home: HouseIcon,
        package: PackageIcon,
        shoppingCart: ShoppingCartIcon,
        users: UsersIcon,
        headphones: HeadphonesIcon,
        chevronRight: ChevronRightIcon
    };

    navItems: NavItem[] = [
        {
            label: 'Dashboard',
            route: '/admin',
            icon: this.icons.home
        },
        {
            label: 'Products',
            route: '/admin/products',
            icon: this.icons.package,
            tabs: [
                { label: 'All Products', route: '/admin/products' },
                { label: 'Add Product', route: '/admin/products/add' }
            ]
        },
        {
            label: 'Sales',
            route: '/admin/sales',
            icon: this.icons.shoppingCart,
            tabs: [
                { label: 'Orders', route: '/admin/sales/orders' },
                { label: 'Create Order', route: '/admin/sales/create' }
            ]
        },
        {
            label: 'Users',
            route: '/admin/users',
            icon: this.icons.users,
            tabs: [
                { label: 'All Users', route: '/admin/users' },
                { label: 'Create User', route: '/admin/users/create' }
            ]
        },
        {
            label: 'Support',
            route: '/admin/support',
            icon: this.icons.headphones,
            tabs: [
                { label: 'Queries', route: '/admin/support/queries' },
                { label: 'Reports', route: '/admin/support/reports' }
            ]
        }
    ];

    // Helper: is this parent route active?
    isActiveParent = (route: string) => {
        const current = window.location.pathname;
        return current.startsWith(route) && route !== '/admin';
    };

    // Helper: get current nav item with tabs
    currentNavItem = () => {
        const path = window.location.pathname;
        return this.navItems.find(item =>
            item.tabs && path.startsWith(item.route)
        );
    };

    toggleSidebar() {
        this.sidebarOpen.update(v => !v);
    }
}