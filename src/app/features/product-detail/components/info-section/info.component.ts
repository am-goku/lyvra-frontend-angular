import { Component, Input, signal, inject, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { HeartIcon, LucideAngularModule, ShoppingCartIcon, MinusIcon, PlusIcon, TruckIcon, ShieldCheckIcon, RefreshCwIcon, StarIcon } from "lucide-angular";
import { ProductMediaComponent } from "../media-section/media.component";
import { SingleProductResponse } from "../../../../models/product.model";
import { CommonModule } from "@angular/common";
import { CartService } from "../../../../core/services/cart.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { LoggerService } from "../../../../core/services/logger.service";
import { AuthService } from "../../../../core/services/auth.service";
import { Router } from "@angular/router";
import { PriceTagComponent } from "../../../../shared/components/price-tag/price-tag.component";

@Component({
    selector: 'product-info-section',
    standalone: true,
    imports: [LucideAngularModule, ProductMediaComponent, CommonModule, PriceTagComponent],
    templateUrl: './info.component.html'
})
export class ProductInfoComponent {
    private cartService = inject(CartService);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private destroyRef = inject(DestroyRef);
    private authService = inject(AuthService);
    private router = inject(Router);

    Math = Math; // Expose Math to template

    CartIcon = ShoppingCartIcon;
    HeartIcon = HeartIcon;
    MinusIcon = MinusIcon;
    PlusIcon = PlusIcon;
    TruckIcon = TruckIcon;
    ShieldCheckIcon = ShieldCheckIcon;
    RefreshCwIcon = RefreshCwIcon;
    StarIcon = StarIcon;

    @Input() product: SingleProductResponse | null = null;

    // State management
    selectedSize = signal<string>('M');
    selectedColor = signal<string>('Black');
    quantity = signal<number>(1);
    activeTab = signal<'overview' | 'specifications' | 'reviews'>('overview');
    isFavorite = signal(false);
    isAddingToCart = signal(false);

    // Mock data - replace with actual product data
    sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    colors = [
        { name: 'Black', hex: '#1F2937' },
        { name: 'White', hex: '#F3F4F6' },
        { name: 'Navy', hex: '#1E3A8A' },
        { name: 'Gray', hex: '#6B7280' }
    ];

    // Mock specifications - should come from backend
    specifications = {
        'Brand': 'Premium Brand',
        'Material': 'Premium Cotton Blend',
        'Fit': 'Regular Fit',
        'Sleeve': 'Short Sleeve',
        'Pattern': 'Solid',
        'Occasion': 'Casual',
        'Care Instructions': 'Machine Wash',
        'Country of Origin': 'India'
    };

    // Mock stock and pricing data
    getStockQuantity(): number {
        return this.product?.stock ?? 15; // Use product stock if available
    }

    getOriginalPrice(): number {
        return this.product?.price ? this.product.price * 1.3 : 0;
    }

    getDiscountPercentage(): number {
        if (!this.product?.price) return 0;
        const original = this.getOriginalPrice();
        return Math.round(((original - this.product.price) / original) * 100);
    }

    hasDiscount(): boolean {
        return this.getDiscountPercentage() > 0;
    }

    getRating(): number {
        return 4.5; // TODO: Get from product data
    }

    getReviewCount(): number {
        return 128; // TODO: Get from product data
    }

    getStockStatus(): 'in-stock' | 'low-stock' | 'out-of-stock' {
        const stock = this.getStockQuantity();
        if (stock === 0) return 'out-of-stock';
        if (stock < 10) return 'low-stock';
        return 'in-stock';
    }

    // Actions
    incrementQuantity() {
        const stock = this.getStockQuantity();
        if (this.quantity() < stock) {
            this.quantity.update(q => q + 1);
        }
    }

    decrementQuantity() {
        if (this.quantity() > 1) {
            this.quantity.update(q => q - 1);
        }
    }

    selectSize(size: string) {
        this.selectedSize.set(size);
    }

    selectColor(colorName: string) {
        this.selectedColor.set(colorName);
    }

    switchTab(tab: 'overview' | 'specifications' | 'reviews') {
        this.activeTab.set(tab);
    }

    toggleFavorite() {
        this.isFavorite.update(val => !val);
    }

    addToCart() {
        if (!this.product) {
            this.logger.error('Cannot add to cart: product is undefined');
            return;
        }

        if (this.getStockStatus() === 'out-of-stock') {
            this.notification.warning('This product is out of stock');
            return;
        }

        if (!this.authService.isAuthenticated()) {
            this.notification.info('Please login to add items to cart');
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
            return;
        }

        this.isAddingToCart.set(true);

        // Note: Backend currently doesn't support size/color in cart item
        this.logger.debug('Adding to cart with options (client-side only for now)', {
            productId: this.product.id,
            size: this.selectedSize(),
            color: this.selectedColor(),
            quantity: this.quantity()
        });

        this.cartService.addToCart(this.product.id, this.quantity())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.isAddingToCart.set(false);
                    this.notification.success(`${this.product?.name} added to cart!`);
                    this.logger.info('Product added to cart', { productId: this.product?.id, quantity: this.quantity() });
                },
                error: (err) => {
                    this.isAddingToCart.set(false);
                    this.logger.error('Failed to add product to cart', err);
                    this.notification.error('Failed to add to cart. Please try again.');
                }
            });
    }
}