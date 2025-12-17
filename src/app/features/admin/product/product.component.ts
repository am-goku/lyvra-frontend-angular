import { ChangeDetectionStrategy, Component, computed, signal, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../core/services/products.service';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { LoggerService } from '../../../core/services/logger.service';

interface DisplayProduct extends Product {
  stock: number;
  sales?: number;
  isListed?: boolean;
  categories?: Category[]; // Ensure this matches backend response
  imageUrl?: string; // Derived from images array
}

interface SortState {
  column: keyof DisplayProduct | '';
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private notification = inject(NotificationService);
  private logger = inject(LoggerService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // --- State Signals ---
  allProducts = signal<DisplayProduct[]>([]);
  categories = signal<Category[]>([]);

  searchTerm = signal<string>('');
  filterCategory = signal<string>('all');
  sortState = signal<SortState>({ column: 'name', direction: 'asc' });
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  selectedProducts = signal<number[]>([]); // Array of selected product IDs

  // Modal state (For Quick Edit/View only)
  isModalOpen = signal<boolean>(false);
  editingProduct = signal<DisplayProduct | null>(null);

  // Table columns
  columns = [
    { key: 'name', label: 'Product' },
    { key: 'stock', label: 'Stock' },
    { key: 'price', label: 'Price' },
    { key: 'sales', label: 'Sales' },
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    // Load Categories
    this.categoryService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(cats => this.categories.set(cats));

    // Load Products
    this.productService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any[]) => {
          // Map backend data to DisplayProduct
          const mapped: DisplayProduct[] = data.map(p => ({
            ...p,
            stock: p.stock ?? Math.floor(Math.random() * 100), // Fallback if missing
            sales: p.sales ?? Math.floor(Math.random() * 500),
            isListed: p.isListed ?? true,
            imageUrl: p.images && p.images.length > 0 ? p.images[0].url : 'assets/placeholder.png',
            categories: p.categories || []
          }));
          this.allProducts.set(mapped);
        },
        error: (err) => {
          this.logger.error('Failed to load products', err);
          this.notification.error('Failed to load products');
        }
      });
  }

  // --- Filtering & Sorting Logic ---
  filteredProducts = computed(() => {
    const products = this.allProducts();
    const term = this.searchTerm().toLowerCase();
    const categoryId = this.filterCategory();
    const sort = this.sortState();

    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(term) || p.id.toString().includes(term);
      // Filter by category ID if not 'all'
      const matchesCategory = categoryId === 'all' ||
        (p.categories?.some(c => c.id.toString() === categoryId) ?? false);
      return matchesSearch && matchesCategory;
    });

    // Sorting
    const column = sort.column;
    if (column) {
      result.sort((a, b) => {
        const valA = a[column] as any;
        const valB = b[column] as any;

        let comparison = 0;
        if (valA > valB) comparison = 1;
        else if (valA < valB) comparison = -1;

        return sort.direction === 'asc' ? comparison : comparison * -1;
      });
    }

    if (this.currentPage() > 1 && result.length <= (this.currentPage() - 1) * this.pageSize()) {
      setTimeout(() => this.currentPage.set(1), 0);
    }
    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.pageSize()) || 1);

  pagedProducts = computed(() => {
    const products = this.filteredProducts();
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return products.slice(start, end);
  });

  displayRange = computed(() => {
    const currentProducts = this.filteredProducts();
    const total = currentProducts.length;
    if (total === 0) return { start: 0, end: 0, total: 0 };
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), total);
    return { start, end, total };
  });

  // --- Handlers ---
  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  onFilter(event: Event) {
    this.filterCategory.set((event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
  }

  setSort(column: string) { // Cast as string to match any key
    this.sortState.update(currentSort => {
      if (currentSort.column === column) {
        return { column: column as keyof DisplayProduct, direction: currentSort.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { column: column as keyof DisplayProduct, direction: 'asc' };
      }
    });
    this.currentPage.set(1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // --- Selection ---
  areAllSelected = computed(() => {
    const currentProductIds = this.pagedProducts().map(p => p.id);
    return currentProductIds.length > 0 && currentProductIds.every(id => this.selectedProducts().includes(id));
  });

  isIndeterminate = computed(() => {
    const selectedCount = this.selectedProducts().length;
    const allCount = this.pagedProducts().length;
    return selectedCount > 0 && selectedCount < allCount;
  });

  toggleProductSelection(id: number) {
    this.selectedProducts.update(ids => {
      const index = ids.indexOf(id);
      if (index > -1) ids.splice(index, 1);
      else ids.push(id);
      return [...ids];
    });
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentProductIds = this.pagedProducts().map(p => p.id);

    this.selectedProducts.update(ids => {
      let newIds = [...ids];
      if (isChecked) {
        currentProductIds.forEach(id => {
          if (!newIds.includes(id)) newIds.push(id);
        });
      } else {
        newIds = newIds.filter(id => !currentProductIds.includes(id));
      }
      return newIds;
    });
  }

  // --- Actions ---
  bulkToggleListing(isListed: boolean) {
    // Mock implementation for bulk toggle, or loop updateProduct
    const selectedIds = this.selectedProducts();
    if (selectedIds.length === 0) return;

    this.notification.info('Bulk update not fully implemented in backend yet');
    // Optimistic update
    this.allProducts.update(products =>
      products.map(p => selectedIds.includes(p.id) ? { ...p, isListed } : p)
    );
    this.selectedProducts.set([]);
  }

  bulkDelete() {
    const selectedIds = this.selectedProducts();
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} products?`)) return;

    // Loop delete (naive)
    selectedIds.forEach(id => {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.allProducts.update(p => p.filter(item => item.id !== id));
        },
        error: () => this.notification.error(`Failed to delete product ${id}`)
      });
    });
    this.selectedProducts.set([]);
  }

  // --- Modal ---
  openProductModal(product: DisplayProduct | null) {
    if (product) {
      // Edit mode
      this.editingProduct.set({ ...product });
      this.isModalOpen.set(true);
    } else {
      // Add mode -> Redirect
      this.router.navigate(['/admin/products/new']);
    }
  }

  closeProductModal() {
    this.isModalOpen.set(false);
    this.editingProduct.set(null);
  }

  updateModalField(key: keyof DisplayProduct, event: Event) {
    const target = event.target as HTMLInputElement;
    let value: any = target.value;
    if (key === 'price' || key === 'stock') value = parseFloat(value) || 0;

    this.editingProduct.update(p => p ? { ...p, [key]: value } : null);
  }

  saveProductChanges() {
    const product = this.editingProduct();
    if (!product) return;

    this.productService.updateProduct(product.id, product)
      .subscribe({
        next: () => {
          this.notification.success('Product updated');
          this.allProducts.update(list => list.map(p => p.id === product.id ? product : p));
          this.closeProductModal();
        },
        error: (err) => this.notification.error('Failed to update product')
      });
  }

  deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.allProducts.update(p => p.filter(item => item.id !== id));
        this.notification.success('Product deleted');
        if (this.isModalOpen()) this.closeProductModal();
      },
      error: (err) => this.notification.error('Failed to delete product')
    });
  }

  toggleListing(product: DisplayProduct) {
    const newVal = !product.isListed;
    this.productService.updateProduct(product.id, { isListed: newVal }).subscribe({
      next: () => {
        this.allProducts.update(list => list.map(p => p.id === product.id ? { ...p, isListed: newVal } : p));
        this.notification.success(`Product ${newVal ? 'listed' : 'unlisted'}`);
      },
      error: () => this.notification.error('Update failed')
    });
  }
}