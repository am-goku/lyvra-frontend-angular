import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChevronDownIcon, ChevronUpIcon, CircleCheckBigIcon, CircleXIcon, EllipsisVerticalIcon, FunnelIcon, LockIcon, LockOpenIcon, LucideAngularModule, SearchIcon, Trash2Icon, UserPlusIcon, X } from "lucide-angular";

interface User {
    id: string;
    name: string;
    email: string;
    orders: number;
    active: boolean;
    createdAt: Date;
}

interface SortOption {
    field: 'name' | 'createdAt' | 'orders';
    direction: 'asc' | 'desc';
}

@Component({
    selector: 'admin-users',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class AdminUsersComponent {
    // Icons
    icons = {
        search: SearchIcon,
        filter: FunnelIcon,
        chevronDown: ChevronDownIcon,
        chevronUp: ChevronUpIcon,
        moreVertical: EllipsisVerticalIcon,
        x: X,
        checkCircle: CircleCheckBigIcon,
        xCircle: CircleXIcon,
        trash2: Trash2Icon,
        lock: LockIcon,
        unlock: LockOpenIcon,
        userPlus: UserPlusIcon,
    };

    // Mock Data
    private allUsers = signal<User[]>([
        { id: '1', name: 'John Doe', email: 'john@example.com', orders: 12, active: true, createdAt: new Date('2024-01-15') },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', orders: 8, active: true, createdAt: new Date('2024-02-20') },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com', orders: 25, active: false, createdAt: new Date('2023-12-10') },
        { id: '4', name: 'Alice Brown', email: 'alice@example.com', orders: 3, active: true, createdAt: new Date('2024-03-05') },
        { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', orders: 45, active: true, createdAt: new Date('2023-11-01') },
        { id: '6', name: 'Diana Prince', email: 'diana@example.com', orders: 0, active: false, createdAt: new Date('2024-04-12') },
        { id: '7', name: 'Evan Davis', email: 'evan@example.com', orders: 19, active: true, createdAt: new Date('2024-01-28') },
        { id: '8', name: 'Fiona Green', email: 'fiona@example.com', orders: 7, active: true, createdAt: new Date('2024-02-14') },
    ]);

    //Globals
    Math = Math;

    // State
    searchTerm = signal('');
    filters = signal({ active: null as boolean | null, ordersMin: '', ordersMax: '' });
    sort = signal<SortOption>({ field: 'createdAt', direction: 'desc' });
    multiSelect = signal(false);
    selectedUsers = signal<Set<string>>(new Set());
    selectedUser = signal<User | null>(null);
    showFilters = signal(false);

    // Pagination
    currentPage = signal(1);
    pageSize = 5;

    // Computed
    filteredUsers = computed(() => {
        let users = this.allUsers();

        // Search
        const term = this.searchTerm().toLowerCase();
        if (term) {
            users = users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
        }

        // Filters
        const f = this.filters();
        if (f.active !== null) {
            users = users.filter(u => u.active === f.active);
        }
        if (f.ordersMin) {
            users = users.filter(u => u.orders >= +f.ordersMin);
        }
        if (f.ordersMax) {
            users = users.filter(u => u.orders <= +f.ordersMax);
        }

        // Sort
        const s = this.sort();
        users = [...users].sort((a, b) => {
            let valA, valB;
            if (s.field === 'name') { valA = a.name; valB = b.name; }
            else if (s.field === 'createdAt') { valA = a.createdAt.getTime(); valB = b.createdAt.getTime(); }
            else { valA = a.orders; valB = b.orders; }

            if (s.direction === 'asc') return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });

        return users;
    });

    paginatedUsers = computed(() => {
        const start = (this.currentPage() - 1) * this.pageSize;
        return this.filteredUsers().slice(start, start + this.pageSize);
    });

    totalPages = computed(() => Math.ceil(this.filteredUsers().length / this.pageSize));
    pageNumbers = computed(() => {
        const total = this.totalPages();
        return Array.from({ length: total }, (_, i) => i + 1);
    });

    activeFiltersCount = computed(() => {
        let count = 0;
        const f = this.filters();
        if (f.active !== null) count++;
        if (f.ordersMin) count++;
        if (f.ordersMax) count++;
        return count;
    });

    allSelected = computed(() => {
        const users = this.filteredUsers();
        return users.length > 0 && users.every(u => this.selectedUsers().has(u.id));
    });

    selectedBlocked = computed(() => {
        const selected = [...this.selectedUsers()].map(id => this.allUsers().find(u => u.id === id));
        return selected.length > 0 && selected.every(u => u && !u.active);
    });

    // Actions
    onSearch() { this.currentPage.set(1); }
    applyFilters() { this.currentPage.set(1); this.showFilters.set(false); }
    applySort() { this.currentPage.set(1); }

    toggleMultiSelect() {
        if (!this.multiSelect()) {
            this.selectedUsers.set(new Set());
        }
    }

    toggleSelect(id: string) {
        this.selectedUsers.update(set => {
            const newSet = new Set(set);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }

    toggleAll() {
        if (this.allSelected()) {
            this.selectedUsers.set(new Set());
        } else {
            const pageIds = this.paginatedUsers().map(u => u.id);
            this.selectedUsers.set(new Set(pageIds));
        }
    }

    openUserModal(user: User) {
        this.selectedUser.set(user);
    }

    closeModal() {
        this.selectedUser.set(null);
    }

    toggleBlock(id: string) {
        this.allUsers.update(users =>
            users.map(u => u.id === id ? { ...u, active: !u.active } : u)
        );
        this.closeModal();
    }

    deleteUser(id: string) {
        this.allUsers.update(users => users.filter(u => u.id !== id));
        this.selectedUsers.update(set => {
            const newSet = new Set(set);
            newSet.delete(id);
            return newSet;
        });
        this.closeModal();
    }

    bulkBlock() {
        const block = !this.selectedBlocked();
        this.allUsers.update(users =>
            users.map(u => this.selectedUsers().has(u.id) ? { ...u, active: !block } : u)
        );
        this.selectedUsers.set(new Set());
    }

    bulkDelete() {
        if (confirm(`Delete ${this.selectedUsers().size} users?`)) {
            this.allUsers.update(users => users.filter(u => !this.selectedUsers().has(u.id)));
            this.selectedUsers.set(new Set());
        }
    }

    // Pagination
    prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
    nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
    goToPage(page: number) { this.currentPage.set(page); }

    formatDate(date: Date) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
}