import { Component } from "@angular/core";
import { CartItemComponent } from "../item-card/item.component";

@Component({
    selector: 'cart-item-list',
    standalone: true,
    imports: [CartItemComponent],
    templateUrl: './list.component.html'
})
export class CartItemListComponent {
    cartItems = [
        { id: 1, name: 'Floral Maxi Dress', size: 'M', color: 'Red', price: 1299, quantity: 1 },
        { id: 2, name: 'Casual Denim Jacket', size: 'L', color: 'Blue', price: 1599, quantity: 2 },
        { id: 3, name: 'Men’s Polo T-Shirt', size: 'S', color: 'White', price: 899, quantity: 1 },
    ];

    decreaseQty(id: number) {
        this.cartItems.forEach((i) => {
            if (i.id === id) {
                if (i.quantity > 1) i.quantity = i.quantity - 1;
                else this.removeItem(id)
            }
        })
    }

    increaseQty(id: number) {
        this.cartItems.forEach((i) => {
            if (i.id === id) i.quantity = i.quantity + 1;
        })
    }

    removeItem(id: number) {
        this.cartItems = this.cartItems.filter(i => i.id !== id)
    }
}