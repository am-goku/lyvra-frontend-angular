import { ChangeDetectionStrategy, Component, computed, signal, effect, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';
import { LoggerService } from '../../../core/services/logger.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Order } from '../../../models/order.model';
import { User } from '../../../models/user.model';

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

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
    private orderService = inject(OrderService);
    private userService = inject(UserService);
    private logger = inject(LoggerService);
    private notification = inject(NotificationService);
    private destroyRef = inject(DestroyRef);

    // --- State Signals ---
    periods: FilterPeriod[] = [
        { id: '7d', label: 'Last 7 Days' },
        { id: '30d', label: 'Last 30 Days' },
        { id: '90d', label: 'Last 90 Days' },
        { id: 'ytd', label: 'Year To Date' },
    ];
    selectedPeriod = signal<FilterPeriod>(this.periods[1]); // Default to Last 30 Days

    // Raw data
    rawSalesData = signal<SaleRecord[]>([]);
    rawUserStats = signal<UserMetric[]>([]);
    isLoading = signal(false);

    // --- Initialization ---

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.isLoading.set(true);
        forkJoin({
            orders: this.orderService.getOrders(), // Assuming fetching all orders for stats
            users: this.userService.getUsers()
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ({ orders, users }) => {
                    this.processOrders(orders);
                    this.processUsers(users);
                    this.isLoading.set(false);
                },
                error: (err) => {
                    this.logger.error('Failed to load dashboard data', err);
                    this.notification.error('Failed to load dashboard stats');
                    this.isLoading.set(false);
                }
            });
    }

    private processOrders(orders: Order[]) {
        // Group by Date
        const salesMap = new Map<string, { revenue: number, orders: number }>();

        orders.forEach(order => {
            if (!order.createdAt) return;
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            const current = salesMap.get(date) || { revenue: 0, orders: 0 };

            // Only count paid/delivered orders for revenue ideally, but using all for now
            salesMap.set(date, {
                revenue: current.revenue + (order.total || 0),
                orders: current.orders + 1
            });
        });

        const sales: SaleRecord[] = Array.from(salesMap.entries()).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders,
            aov: data.orders > 0 ? data.revenue / data.orders : 0
        })).sort((a, b) => a.date.localeCompare(b.date));

        this.rawSalesData.set(sales);
    }

    private processUsers(users: User[]) {
        // Mocking country distribution as it's not in User model
        const total = users.length;
        // Assume recent users are "new" (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newUsersCount = users.filter(u => u.createdAt && new Date(u.createdAt) >= thirtyDaysAgo).length;

        // One mock entry for "Global" since we don't track country
        const metric: UserMetric = {
            country: 'Global',
            newUsers: newUsersCount,
            totalUsers: total
        };
        this.rawUserStats.set([metric]);
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
        return revenues.length > 0 ? Math.max(...revenues) : 0;
    });

    avgDailyRevenue = computed(() => {
        const filtered = this.filteredSales();
        if (filtered.length === 0) return 0;
        return this.totalRevenue() / filtered.length;
    });

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