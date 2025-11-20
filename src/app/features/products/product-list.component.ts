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

  constructor(private readonly productService: ProductService) { };

  ngOnInit(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res as Product[])
      },
      error: (err) => console.log("Error occured", err),
      complete: () => this.loading.set(false)
    })
  }
}
