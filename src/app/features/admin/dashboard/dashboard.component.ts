import { ChangeDetectionStrategy, Component, computed, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Interfaces for Data Structure ---

interface Kpi {
    title: string;
    value: number;
    unit: string;
    icon: string; // Represents a Lucide icon name for display
    color: string;
}

interface SaleRecord {
    date: string; // YYYY-MM-DD
    revenue: number;
    orders: number;
    aov: number; // Average Order Value (Revenue / Orders)
}

interface UserMetric {
    country: string;
    newUsers: number;
    totalUsers: number;
}

interface FilterPeriod {
    id: '7d' | '30d' | '90d' | 'ytd';
    label: string;
}

// --- Utility Functions for Data ---

/**
 * Simulates fetching and processing raw data.
 * In a real app, this would come from a service/API.
 */
function getSimulatedData(): { sales: SaleRecord[], users: UserMetric[] } {
    // Generate 30 days of synthetic sales data
    const sales: SaleRecord[] = Array(30).fill(0).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const revenue = Math.floor(Math.random() * 5000) + 1000;
        const orders = Math.floor(Math.random() * 50) + 10;
        const aov = parseFloat((revenue / orders).toFixed(2));

        return {
            date: date.toISOString().split('T')[0],
            revenue,
            orders,
            aov
        };
    }).reverse(); // Sort oldest to newest

    const users: UserMetric[] = [
        { country: 'United States', newUsers: 120, totalUsers: 5800 },
        { country: 'Germany', newUsers: 45, totalUsers: 2100 },
        { country: 'Japan', newUsers: 30, totalUsers: 1550 },
        { country: 'Brazil', newUsers: 55, totalUsers: 1900 },
    ];

    return { sales, users };
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
    // --- State Signals ---
    periods: FilterPeriod[] = [
        { id: '7d', label: 'Last 7 Days' },
        { id: '30d', label: 'Last 30 Days' },
        { id: '90d', label: 'Last 90 Days' },
        { id: 'ytd', label: 'Year To Date' },
    ];
    selectedPeriod = signal<FilterPeriod>(this.periods[1]); // Default to Last 30 Days

    // Raw data (simulated)
    rawSalesData = signal<SaleRecord[]>([]);
    rawUserStats = signal<UserMetric[]>([]);

    // --- Initialization ---

    ngOnInit(): void {
        const { sales, users } = getSimulatedData();
        this.rawSalesData.set(sales);
        this.rawUserStats.set(users);
    }

    // --- Filtering Logic (Computed Signals) ---

    /** Filters the sales data based on the selected time period. */
    filteredSales = computed(() => {
        const sales = this.rawSalesData();
        const periodId = this.selectedPeriod().id;

        const today = new Date();
        let cutoffDate = new Date();
        cutoffDate.setHours(0, 0, 0, 0);

        switch (periodId) {
            case '7d':
                cutoffDate.setDate(today.getDate() - 7);
                break;
            case '30d':
                cutoffDate.setDate(today.getDate() - 30);
                break;
            case '90d':
                cutoffDate.setDate(today.getDate() - 90);
                break;
            case 'ytd':
                cutoffDate = new Date(today.getFullYear(), 0, 1); // Start of the current year
                break;
        }

        // Filter the sales records
        return sales.filter(sale => new Date(sale.date) >= cutoffDate);
    });

    // --- Aggregation Logic (Computed Signals) ---

    totalRevenue = computed(() => {
        return this.filteredSales().reduce((sum, record) => sum + record.revenue, 0);
    });

    totalOrders = computed(() => {
        return this.filteredSales().reduce((sum, record) => sum + record.orders, 0);
    });

    averageOrderValue = computed(() => {
        const totalRev = this.totalRevenue();
        const totalOrd = this.totalOrders();
        return totalOrd > 0 ? totalRev / totalOrd : 0;
    });

    totalNewUsers = computed(() => {
        return this.rawUserStats().reduce((sum, stat) => sum + stat.newUsers, 0);
    });

    maxRevenue = computed(() => {
        const revenues = this.filteredSales().map(s => s.revenue);
        return Math.max(...revenues);
    })

    avgDailyRevenue = computed(() => {
        const filtered = this.filteredSales();
        if (filtered.length === 0) return 0;
        return this.totalRevenue() / filtered.length;
    })

    computedKpis = computed<Kpi[]>(() => {
        return [
            {
                title: 'Total Revenue',
                value: this.totalRevenue(),
                unit: '$',
                icon: 'dollar',
                color: 'border-l-indigo-600',
            },
            {
                title: 'Total Orders',
                value: this.totalOrders(),
                unit: 'Units',
                icon: 'package',
                color: 'border-l-green-600',
            },
            {
                title: 'Average Order Value (AOV)',
                value: this.averageOrderValue(),
                unit: '$',
                icon: 'trending-up',
                color: 'border-l-amber-500',
            },
            {
                title: 'New User Signups',
                value: this.totalNewUsers(),
                unit: 'Users',
                icon: 'users',
                color: 'border-l-red-500',
            },
        ];
    });

    // --- Event Handlers ---

    onPeriodChange(event: Event) {
        const selectedId = (event.target as HTMLSelectElement).value as FilterPeriod['id'];
        const newPeriod = this.periods.find(p => p.id === selectedId);
        if (newPeriod) {
            this.selectedPeriod.set(newPeriod);
        }
    }

    // --- Formatting Helpers ---

    formatValue(value: number, unit: string): string {
        const formatted = parseFloat(value.toFixed(2)).toLocaleString('en-US', {
            minimumFractionDigits: unit === '$' ? 2 : 0,
            maximumFractionDigits: unit === '$' ? 2 : 0,
        });
        return unit === '$' ? `${unit}${formatted}` : `${formatted} ${unit}`;
    }
}