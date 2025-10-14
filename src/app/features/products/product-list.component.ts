import { Component } from '@angular/core';
import { FilterComponent } from "./components/filter/filter.component";
import { SearchComponent } from "./components/search/search.component";
import { ProductGrid } from './components/grid/grid.component';
import { ProductPagination } from './components/pagination/pagination.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  imports: [FilterComponent, SearchComponent, ProductGrid, ProductPagination]
})
export class ProductListComponent {}
