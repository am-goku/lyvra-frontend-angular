import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CartItems } from "../../../../models/cart.model";
import { TrashIcon, HeartIcon, LucideAngularModule, LoaderCircleIcon } from "lucide-angular";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'cart-item',
    standalone: true,
    imports: [LucideAngularModule, CommonModule],
    templateUrl: './item.component.html'
})
export class CartItemComponent {
    TrashIcon = TrashIcon;
    HeartIcon = HeartIcon;
    LoaderIcon = LoaderCircleIcon;

    @Input() item!: CartItems;
    @Input() isProcessing: boolean = false;
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