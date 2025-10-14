import { Component } from "@angular/core";
import { ProductCard } from "../product/product.component";

@Component({
    selector: 'product-grid',
    standalone: true,
    imports: [ProductCard],
    templateUrl: './grid.component.html'
})
export class ProductGrid{
    products = Array.from({ length: 12 }, (_, i) => i + 1);
}