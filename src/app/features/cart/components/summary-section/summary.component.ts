import { Component } from "@angular/core";

@Component({
    selector: 'cart-summary',
    standalone: true,
    imports: [],
    templateUrl: './summary.component.html'
})
export class CartSummaryComponent {

    cartItems = [
        { id: 1, name: 'Floral Maxi Dress', size: 'M', color: 'Red', price: 1299, quantity: 1 },
        { id: 2, name: 'Casual Denim Jacket', size: 'L', color: 'Blue', price: 1599, quantity: 2 },
        { id: 3, name: 'Men’s Polo T-Shirt', size: 'S', color: 'White', price: 899, quantity: 1 },
    ];

    getSubtotal() {
        return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    getDiscount() {
        // Example: flat 5% discount
        return Math.round(this.getSubtotal() * 0.05);
    }

    getTax() {
        // Example: 12% GST
        return Math.round((this.getSubtotal() - this.getDiscount()) * 0.12);
    }

    getTotal() {
        return this.getSubtotal() - this.getDiscount() + this.getTax();
    }

};