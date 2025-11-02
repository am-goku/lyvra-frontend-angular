import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    LucideAngularModule,
    Search, Filter, ChevronDown, ChevronUp, MoreVertical,
    X, CheckCircle, XCircle, Trash2, Lock, Unlock, Tag
} from 'lucide-angular';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../models/category.model';

interface SortOption {
    field: 'name' | 'createdAt';
    direction: 'asc' | 'desc';
}

@Component({
    selector: 'app-admin-categories',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class AdminCategoriesComponent implements OnInit {

    constructor(private readonly categoryService: CategoryService) {}

    // Icons
    icons = {
        search: Search,
        filter: Filter,
        chevronDown: ChevronDown,
        chevronUp: ChevronUp,
        moreVertical: MoreVertical,
        x: X,
        checkCircle: CheckCircle,
        xCircle: XCircle,
        trash2: Trash2,
        lock: Lock,
        unlock: Unlock,
        tag: Tag
    };

    Math = Math;

    // Mock Data
    allCategories = signal<Category[]>([]);

    ngOnInit() {
        // Initialize with mock data
        this.categoryService.getCategories().subscribe({
            next: (data: any) => {
                // Assuming data is an array of categories
                this.allCategories.set(data);
            }
        });
    }

    // State
    searchTerm = signal('');
    filters = signal({ active: null as boolean | null });
    sort = signal<SortOption>({ field: 'createdAt', direction: 'desc' });
    multiSelect = signal(false);
    selectedCategories = signal<Set<string>>(new Set());
    selectedCategory = signal<Category | null>(null);
    showFilters = signal(false);

    // Pagination
    currentPage = signal(1);
    pageSize = 5;

    // Computed
    // filteredCategories = computed(() => {
    //     let categories = this.allCategories();

    //     // Search
    //     const term = this.searchTerm().toLowerCase();
    //     if (term) {
    //         categories = categories.filter(c => c.name.toLowerCase().includes(term));
    //     }

    //     // Filters
    //     const f = this.filters();
    //     if (f.active !== null) {
    //         categories = categories.filter(c => c.active === f.active);
    //     }

    //     // Sort
    //     const s = this.sort();
    //     categories = [...categories].sort((a, b) => {
    //         let valA, valB;
    //         if (s.field === 'name') { valA = a.name; valB = b.name; }
    //         else { valA = a.createdAt.getTime(); valB = b.createdAt.getTime(); }

    //         if (s.direction === 'asc') return valA > valB ? 1 : -1;
    //         return valA < valB ? 1 : -1;
    //     });

    //     return categories;
    // });

    // paginatedCategories = computed(() => {
    //     const start = (this.currentPage() - 1) * this.pageSize;
    //     return this.filteredCategories().slice(start, start + this.pageSize);
    // });

    // totalPages = computed(() => Math.ceil(this.filteredCategories().length / this.pageSize));
    // pageNumbers = computed(() => {
    //     const total = this.totalPages();
    //     return Array.from({ length: total }, (_, i) => i + 1);
    // });

    activeFiltersCount = computed(() => {
        return this.filters().active !== null ? 1 : 0;
    });

    // allSelected = computed(() => {
    //     const categories = this.paginatedCategories();
    //     return categories.length > 0 && categories.every(c => this.selectedCategories().has(c.id));
    // });

    // selectedInactive = computed(() => {
    //     const selected = [...this.selectedCategories()].map(id => this.allCategories().find(c => c.id === id));
    //     return selected.length > 0 && selected.every(c => c && !c.active);
    // });

    // Actions
    onSearch() { this.currentPage.set(1); }
    applyFilters() { this.currentPage.set(1); this.showFilters.set(false); }
    applySort() { this.currentPage.set(1); }

    toggleMultiSelect() {
        if (!this.multiSelect()) {
            this.selectedCategories.set(new Set());
        }
    }

    toggleSelect(id: string) {
        this.selectedCategories.update(set => {
            const newSet = new Set(set);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }

    // toggleAll() {
    //     if (this.allSelected()) {
    //         this.selectedCategories.set(new Set());
    //     } else {
    //         const pageIds = this.paginatedCategories().map(c => c.id);
    //         this.selectedCategories.set(new Set(pageIds));
    //     }
    // }

    openCategoryModal(category: Category) {
        this.selectedCategory.set(category);
    }

    closeModal() {
        this.selectedCategory.set(null);
    }

    // toggleStatus(id: string) {
    //     this.allCategories.update(categories =>
    //         categories.map(c => c.id === id ? { ...c, active: !c.active } : c)
    //     );
    //     this.closeModal();
    // }

    // deleteCategory(id: string) {
    //     this.allCategories.update(categories => categories.filter(c => c.id !== id));
    //     this.selectedCategories.update(set => {
    //         const newSet = new Set(set);
    //         newSet.delete(id);
    //         return newSet;
    //     });
    //     this.closeModal();
    // }

    // bulkToggleStatus() {
    //     const activate = !this.selectedInactive();
    //     this.allCategories.update(categories =>
    //         categories.map(c => this.selectedCategories().has(c.id) ? { ...c, active: activate } : c)
    //     );
    //     this.selectedCategories.set(new Set());
    // }

    // bulkDelete() {
    //     if (confirm(`Delete ${this.selectedCategories().size} categories?`)) {
    //         this.allCategories.update(categories => categories.filter(c => !this.selectedCategories().has(c.id)));
    //         this.selectedCategories.set(new Set());
    //     }
    // }

    prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
    // nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }
    goToPage(page: number) { this.currentPage.set(page); }

    formatDate(date: Date) {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
}