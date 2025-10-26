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

    @Input() removeItem?: (id: number) => void; // Optional function input
    @Input() addQuantity?: (id: number) => void;
    @Input() minusQuantity?: (id: number) => void;
}