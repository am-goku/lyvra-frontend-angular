import { Component, EventEmitter, Input, Output } from "@angular/core";
import { HeartIcon, LucideAngularModule, TrashIcon } from "lucide-angular";
import { CartItems } from "../../../../models/cart.model";

@Component({
    selector: 'cart-item',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './item.component.html'
})
export class CartItemComponent {
    HeartIcon = HeartIcon;
    TrashIcon = TrashIcon;

    @Input() item: CartItems | null = null;
    @Output() remove = new EventEmitter<number>();
    @Output() addQ = new EventEmitter<number>();
    @Output() minusQ = new EventEmitter<number>();

    getProductImage(): string {
        if (this.item && this.item.product && this.item.product.images && this.item.product.images.length > 0) {
            return this.item.product.images[0].url;
        }
        return 'https://placehold.co/100x100?text=No+Image'; // Default image
    }
}