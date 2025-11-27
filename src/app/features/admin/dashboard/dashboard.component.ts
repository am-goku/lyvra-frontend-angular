import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'admin-dashboard',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent {

    // sample reactive state (Angular 20 signals)
    query = signal('');
    sidebarOpen = signal(true);

    // sample data
    products = [
        { id: 'P001', name: 'Velvet Sofa', stock: 12, price: 12999, active: true },
        { id: 'P002', name: 'Oak Coffee Table', stock: 5, price: 5999, active: true },
        { id: 'P003', name: 'Wool Rug', stock: 0, price: 3499, active: false },
    ];

    // computed KPI
    totalProducts = computed(() => this.products.length);
    outOfStock = computed(() => this.products.filter(p => p.stock === 0).length);

    // tracking function for @for
    trackById(index: number, item: any) {
        return item.id;
    }

    toggleSidebar() {
        this.sidebarOpen.update(v => !v);
    }

    search(value: string) {
        this.query.set(value);
    }

    // filtered for table using query
    get filteredProducts() {
        const q = this.query();
        if (!q) return this.products;
        return this.products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.id.includes(q));
    }

}