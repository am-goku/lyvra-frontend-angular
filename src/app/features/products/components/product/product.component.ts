import { Component, Input, signal, OnInit } from "@angular/core";
import { HeartIcon, LucideAngularModule, ShoppingBagIcon, EyeIcon, StarIcon } from "lucide-angular";
import { Product } from "../../../../models/product.model";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'product-card',
    standalone: true,
    imports: [LucideAngularModule, RouterLink, CommonModule],
    templateUrl: './product.component.html'
})
export class ProductCard implements OnInit {
    ShoppingBagIcon = ShoppingBagIcon;
    HeartIcon = HeartIcon;
    EyeIcon = EyeIcon;
    StarIcon = StarIcon;

    placeholderImageUrl: string = 'image/placeholder/product-placeholder.jpg';

    isFavorite = signal(false);
    isHovered = signal(false);

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
    }

    addToCart(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', this.product?.name);
    }

    quickView(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        // TODO: Implement quick view modal
        console.log('Quick view:', this.product?.name);
    }

    // Return cached rating value
    getRating(): number {
        return this._rating;
    }

    // Return cached stock status
    getStockStatus(): 'in-stock' | 'low-stock' | 'out-of-stock' {
        return this._stockStatus;
    }

    // Check if product has discount
    hasDiscount(): boolean {
        return false; // TODO: Implement discount logic
    }

    getDiscountPercentage(): number {
        return 0; // TODO: Implement discount calculation
    }
}