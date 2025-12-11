import { Component, Input, signal } from "@angular/core";
import { HeartIcon, LucideAngularModule, ShoppingCartIcon, MinusIcon, PlusIcon, TruckIcon, ShieldCheckIcon, RefreshCwIcon, StarIcon } from "lucide-angular";
import { ProductMediaComponent } from "../media-section/media.component";
import { SingleProductResponse } from "../../../../models/product.model";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'product-info-section',
    standalone: true,
    imports: [LucideAngularModule, ProductMediaComponent, CommonModule],
    templateUrl: './info.component.html'
})
export class ProductInfoComponent {
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
        return 15; // TODO: Get from product data
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
        console.log('Add to cart:', {
            product: this.product?.name,
            size: this.selectedSize(),
            color: this.selectedColor(),
            quantity: this.quantity()
        });
        // TODO: Implement add to cart functionality
    }
}