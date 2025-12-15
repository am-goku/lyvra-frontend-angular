import { Component, DestroyRef, Input, inject, signal, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { HeartIcon, LucideAngularModule, ShoppingBagIcon, StarIcon, EyeIcon } from "lucide-angular";
import { Product } from "../../../../models/product.model";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CartService } from "../../../../core/services/cart.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { LoggerService } from "../../../../core/services/logger.service";

@Component({
    selector: 'product-card',
    standalone: true,
    imports: [LucideAngularModule, RouterLink, CommonModule],
    templateUrl: './product.component.html'
})
export class ProductCard implements OnInit {
    private cartService = inject(CartService);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private destroyRef = inject(DestroyRef);

    ShoppingBagIcon = ShoppingBagIcon;
    HeartIcon = HeartIcon;
    StarIcon = StarIcon;
    EyeIcon = EyeIcon;

    placeholderImageUrl: string = 'image/placeholder/product-placeholder.jpg';

    isFavorite = signal(false);
    isHovered = signal(false);
    isAddingToCart = signal(false);

    // Cache these values to prevent flickering
    private _rating: number = 0;
    private _stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';

    @Input() product?: Product;

    ngOnInit() {
        // Generate random values once on initialization
        this._rating = Math.floor(Math.random() * 2) + 4; // Returns 4 or 5

        const random = Math.random();
        if (random > 0.9) {
            this._stockStatus = 'low-stock';
        } else if (random > 0.97) {
            this._stockStatus = 'out-of-stock';
        } else {
            this._stockStatus = 'in-stock';
        }
    }

    onImgError(event: Event) {
        const element = event.target as HTMLImageElement;
        element.src = this.placeholderImageUrl;
    }

    toggleFavorite(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.isFavorite.update(val => !val);
        // TODO: Implement wishlist API integration
    }

    addToCart(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.product) {
            this.logger.error('Cannot add to cart: product is undefined');
            return;
        }

        if (this._stockStatus === 'out-of-stock') {
            this.notification.warning('This product is out of stock');
            return;
        }

        this.isAddingToCart.set(true);

        this.cartService.addToCart(this.product.id, 1)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.isAddingToCart.set(false);
                    this.notification.success(`${this.product?.name} added to cart!`);
                    this.logger.info('Product added to cart', { productId: this.product?.id });
                },
                error: (err) => {
                    this.isAddingToCart.set(false);
                    this.logger.error('Failed to add product to cart', err);
                    this.notification.error('Failed to add to cart. Please try again.');
                }
            });
    }

    quickView(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        // TODO: Implement quick view modal/dialog
        this.logger.info('Quick view clicked', { productId: this.product?.id });
    }

    // Return cached rating value
    getRating(): number {
        return this._rating;
    }

    // Return cached stock status
    getStockStatus(): 'in-stock' | 'low-stock' | 'out-of-stock' {
        return this._stockStatus;
    }

    /**
     * Check if product has discount
     * Compares original price with current price
     */
    hasDiscount(): boolean {
        if (!this.product) return false;

        // Check if product has both originalPrice and price fields
        // and originalPrice is greater than current price
        return !!(this.product.originalPrice &&
            this.product.price &&
            this.product.originalPrice > this.product.price);
    }

    /**
     * Calculate discount percentage
     * Returns percentage off from original price
     */
    getDiscountPercentage(): number {
        if (!this.product || !this.hasDiscount()) return 0;

        const original = this.product.originalPrice || 0;
        const current = this.product.price || 0;

        if (original === 0) return 0;

        return Math.round(((original - current) / original) * 100);
    }
}