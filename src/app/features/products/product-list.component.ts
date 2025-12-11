import { Component, OnInit, signal } from '@angular/core';
import { FilterComponent } from "./components/filter/filter.component";
import { ProductGrid } from './components/grid/grid.component';
import { ProductPagination } from './components/pagination/pagination.component';
import { ProductService } from '../../core/services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [FilterComponent, ProductGrid, ProductPagination]
})
export class ProductListComponent implements OnInit {

  products = signal<Product[]>([]);

  loading = signal<boolean>(false);

  error = signal<string | null>(null);

  constructor(private readonly productService: ProductService) { };

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProducts().subscribe({
      next: (res) => {
        console.log(res);
        this.products.set(res as Product[]);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error occurred while fetching products:", err);

        // Set user-friendly error message based on error type
        if (err.status === 0) {
          this.error.set('Unable to connect to the server. Please check your internet connection.');
        } else if (err.status >= 500) {
          this.error.set('Our servers are currently experiencing issues. Please try again later.');
        } else if (err.status === 404) {
          this.error.set('Products endpoint not found. Please contact support.');
        } else if (err.status === 401 || err.status === 403) {
          this.error.set('You are not authorized to view products. Please log in.');
        } else {
          this.error.set('Failed to load products. Please try again.');
        }

        this.products.set([]);
        this.loading.set(false);
      }
    });
  }

  retryLoading(): void {
    this.loadProducts();
  }
}
