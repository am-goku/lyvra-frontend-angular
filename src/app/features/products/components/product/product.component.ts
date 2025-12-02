import { Component, Input } from "@angular/core";
import { HeartIcon, LucideAngularModule, ShoppingBagIcon } from "lucide-angular";
import { Product } from "../../../../models/product.model";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'product-card',
    standalone: true,
    imports: [LucideAngularModule, RouterLink],
    templateUrl: './product.component.html'
})
export class ProductCard {
    ShoppingBagIcon = ShoppingBagIcon;
    HeartIcon = HeartIcon;

    placeholderImageUrl: string = 'image/placeholder/product-placeholder.jpg';

    onImgError(event: Event) {
        const element = event.target as HTMLImageElement;
        element.src = this.placeholderImageUrl;
    }

    @Input() product?: Product;
};