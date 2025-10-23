import { Component, Input } from "@angular/core";
import { ProductCard } from "../product/product.component";
import { Product } from "../../../../models/product.model";

@Component({
    selector: 'product-grid',
    standalone: true,
    imports: [ProductCard],
    templateUrl: './grid.component.html'
})
export class ProductGrid{
    @Input() products: Product[] = [];
}