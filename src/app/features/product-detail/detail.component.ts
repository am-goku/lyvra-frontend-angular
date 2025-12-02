import { Component, inject, OnInit, signal } from "@angular/core";
import { ProductInfoComponent } from "./components/info-section/info.component";
import { ProductReviewComponent } from "./components/review-section/review.component";
import { RelatedProductComponent } from "./components/related-section/related.component";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../core/services/products.service";

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [ProductInfoComponent, ProductReviewComponent, RelatedProductComponent],
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})

export class ProductDetailComponent implements OnInit {

    product = signal<{ [key: string]: any } | null>(null);

    private route = inject(ActivatedRoute);
    private productId: string = '';

    constructor(private readonly productService: ProductService) { }


    ngOnInit() {
        this.productId = this.route.snapshot.paramMap.get('productId') as string;
        console.log('Product ID:', this.productId);
        this.productService.getProductById(Number(this.productId)).subscribe({
            next(value) {
                console.log('Product Details:', value);
                // this.product.set(value as { [key: string]: any });
            },
            error(err) {
                console.error('Error fetching product details:', err);
            }
        })
    }
};