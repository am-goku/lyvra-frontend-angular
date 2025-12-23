import { CommonModule } from "@angular/common";
import { Component, DestroyRef, OnInit, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChevronDownIcon, ChevronUpIcon, CircleCheckBigIcon, CircleXIcon, EllipsisVerticalIcon, FunnelIcon, LockIcon, LockOpenIcon, LucideAngularModule, SearchIcon, Trash2Icon, UserPlusIcon, X } from "lucide-angular";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { User } from "../../../models/user.model";
import { UserService } from "../../../core/services/user.service";
import { NotificationService } from "../../../core/services/notification.service";
import { LoggerService } from "../../../core/services/logger.service";

interface UserViewModel extends User {
    orders?: number; // Optional as it might not be in User model yet
    active?: boolean;
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
export class AdminUsersComponent implements OnInit {
    private userService = inject(UserService);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private destroyRef = inject(DestroyRef);

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

    // Globals
    Math = Math;

    // State
    allUsers = signal<UserViewModel[]>([]); // Data source
    isLoading = signal(false);

    searchTerm = signal('');
    filters = signal({ active: null as boolean | null, ordersMin: '', ordersMax: '' });
    sort = signal<SortOption>({ field: 'createdAt', direction: 'desc' });
    multiSelect = signal(false);
    selectedUsers = signal<Set<number>>(new Set());
    selectedUser = signal<UserViewModel | null>(null);
    showFilters = signal(false);

    // Pagination
    currentPage = signal(1);
    pageSize = 5;

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.isLoading.set(true);
        this.userService.getAllUsers()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (users) => {
                    // Map response to view model (adding mock stats if missing from API)
                    const mappedUsers = users.map(u => ({
                        ...u,
                        orders: Math.floor(Math.random() * 20), // Placeholder if not in API
                        active: true // Placeholder
                    }));
                    this.allUsers.set(mappedUsers);
                    this.isLoading.set(false);
                },
                error: (err) => {
                    this.logger.error('Failed to load users', err);
                    this.notification.error('Failed to load users');
                    this.isLoading.set(false);
                }
            });
    }

    // Computed
    filteredUsers = computed(() => {
        let users = this.allUsers();

        // Search
        const term = this.searchTerm().toLowerCase();
        if (term) {
            users = users.filter(u =>
                (u.name?.toLowerCase().includes(term) ?? false) ||
                u.email.toLowerCase().includes(term)
            );
        }

        // Filters
        const f = this.filters();
        if (f.active !== null) {
            users = users.filter(u => u.active === f.active);
        }
        if (f.ordersMin) {
            users = users.filter(u => (u.orders || 0) >= +f.ordersMin);
        }
        if (f.ordersMax) {
            users = users.filter(u => (u.orders || 0) <= +f.ordersMax);
        }

        // Sort
        const s = this.sort();
        users = [...users].sort((a, b) => {
            let valA: any, valB: any;
            if (s.field === 'name') { valA = a.name || ''; valB = b.name || ''; }
            else if (s.field === 'createdAt') {
                valA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                valB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            }
            else { valA = a.orders || 0; valB = b.orders || 0; }

            if (s.direction === 'asc') return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });

        return users;
    });

    paginatedUsers = computed(() => {
        const start = (this.currentPage() - 1) * this.pageSize;
        return this.filteredUsers().slice(start, start + this.pageSize);
    });

    totalPages = computed(() => Math.ceil(this.filteredUsers().length / this.pageSize) || 1);
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

    toggleSelect(id: number) {
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

    openUserModal(user: UserViewModel) {
        this.selectedUser.set(user);
    }

    closeModal() {
        this.selectedUser.set(null);
    }

    toggleBlock(id: number) {
        // Mock implementation for block (API might need update)
        this.allUsers.update(users =>
            users.map(u => u.id === id ? { ...u, active: !u.active } : u)
        );
        this.closeModal();
    }

    deleteUser(id: number) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        this.userService.deleteUser(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.allUsers.update(users => users.filter(u => u.id !== id));
                    this.selectedUsers.update(set => {
                        const newSet = new Set(set);
                        newSet.delete(id);
                        return newSet;
                    });
                    this.closeModal();
                    this.notification.success('User deleted successfully');
                },
                error: (err) => {
                    this.logger.error('Failed to delete user', err);
                    this.notification.error('Failed to delete user');
                }
            });
    }

    bulkBlock() {
        // Mock implementation
        const block = !this.selectedBlocked();
        this.allUsers.update(users =>
            users.map(u => this.selectedUsers().has(u.id) ? { ...u, active: !block } : u)
        );
        this.selectedUsers.set(new Set());
    }

    bulkDelete() {
        if (!confirm(`Delete ${this.selectedUsers().size} users?`)) return;

        // Note: Real API might not support bulk delete. 
        // We would map promises here or generic loop.
        // For now, removing locally and logging.
        this.logger.info('Bulk delete requested', { ids: [...this.selectedUsers()] });

        this.allUsers.update(users => users.filter(u => !this.selectedUsers().has(u.id)));
        this.selectedUsers.set(new Set());
        this.notification.success('Users deleted locally (Implementation pending API logic)');
    }

    // Pagination
    prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
    nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
    goToPage(page: number) { this.currentPage.set(page); }

    formatDate(date: Date | string | undefined) {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
}