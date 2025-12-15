import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ProductInfoComponent } from "./components/info-section/info.component";
import { ProductReviewComponent } from "./components/review-section/review.component";
import { RelatedProductComponent } from "./components/related-section/related.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../core/services/products.service";
import { SingleProductResponse } from "../../models/product.model";
import { NotificationService } from "../../core/services/notification.service";
import { LoggerService } from "../../core/services/logger.service";

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [ProductInfoComponent, ProductReviewComponent, RelatedProductComponent],
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private productService = inject(ProductService);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private destroyRef = inject(DestroyRef);

    product = signal<SingleProductResponse | null>(null);
    isLoading = signal(false);
    error = signal<string | null>(null);

    ngOnInit() {
        const productId = this.route.snapshot.paramMap.get('productId');

        if (!productId) {
            this.logger.error('Product ID not found in route');
            this.notification.error('Invalid product ID');
            this.router.navigate(['/products']);
            return;
        }

        this.loadProduct(Number(productId));
    }

    private loadProduct(productId: number): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.productService.getProductById(productId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (product) => {
                    this.product.set(product);
                    this.isLoading.set(false);
                    this.logger.debug('Product loaded', { productId });
                },
                error: (err) => {
                    this.isLoading.set(false);
                    this.logger.error('Failed to load product details', err);

                    const errorMessage = err.status === 404
                        ? 'Product not found'
                        : 'Failed to load product details. Please try again.';

                    this.error.set(errorMessage);
                    this.notification.error(errorMessage);
                }
            });
    }

    retryLoading(): void {
        const productId = this.route.snapshot.paramMap.get('productId');
        if (productId) {
            this.loadProduct(Number(productId));
        }
    }
}