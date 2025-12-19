import { LucideAngularModule, Funnel, ChevronDown, LayoutGrid, List, ArrowUpDown } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FilterComponent } from "./components/filter/filter.component";
import { ProductGrid } from './components/grid/grid.component';
import { ProductPagination } from './components/pagination/pagination.component';
import { ProductService } from '../../core/services/products.service';
import { Product } from '../../models/product.model';
import { NotificationService } from '../../core/services/notification.service';
import { LoggerService } from '../../core/services/logger.service';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductCard } from "./components/product/product.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [FilterComponent, ProductPagination, CommonModule, LucideAngularModule, ProductCard]
})
export class ProductListComponent implements OnInit {
  // Icons
  LayoutGridIcon = LayoutGrid;
  ListIcon = List;
  ChevronDownIcon = ChevronDown;
  SortIcon = ArrowUpDown;
  FilterIcon = Funnel;

  // View State
  isGridView = signal(true);
  isSortOpen = signal(false);
  sortBy = signal('newest');
  private productService = inject(ProductService);

  toggleSort() {
    this.isSortOpen.update(v => !v);
  }
  private notification = inject(NotificationService);
  private logger = inject(LoggerService);
  private destroyRef = inject(DestroyRef);

  products = signal<Product[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.products.set(res as Product[]);
          this.error.set(null);
          this.loading.set(false);
          this.logger.debug('Products loaded', { count: res.length });
        },
        error: (err) => {
          this.logger.error('Failed to load products', err);

          // Set user-friendly error message based on error type
          let errorMessage: string;
          if (err.status === 0) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          } else if (err.status >= 500) {
            errorMessage = 'Our servers are currently experiencing issues. Please try again later.';
          } else if (err.status === 404) {
            errorMessage = 'Products endpoint not found. Please contact support.';
          } else if (err.status === 401 || err.status === 403) {
            errorMessage = 'You are not authorized to view products. Please log in.';
          } else {
            errorMessage = 'Failed to load products. Please try again.';
          }

          this.error.set(errorMessage);
          this.notification.error(errorMessage);
          this.products.set([]);
          this.loading.set(false);
        }
      });
  }

  retryLoading(): void {
    this.loadProducts();
  }
}
