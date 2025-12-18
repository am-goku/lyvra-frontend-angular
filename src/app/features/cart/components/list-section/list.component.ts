import { Component, Input } from "@angular/core";
import { CartItemComponent } from "../item-card/item.component";
import { CartItems } from "../../../../models/cart.model";

@Component({
    selector: 'cart-item-list',
    standalone: true,
    imports: [CartItemComponent],
    templateUrl: './list.component.html'
})
export class CartItemListComponent {
    @Input() cartItems: CartItems[] = [];
    @Input() addQuantity: ((id: number) => void) | null = null;
    @Input() minusQuantity: ((id: number) => void) | null = null;
    @Input() removeItem: ((id: number) => void) | null = null;
    @Input() processingItemId: number | null = null;
}