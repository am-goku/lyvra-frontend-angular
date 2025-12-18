import { Component, Input } from "@angular/core";
import { Cart } from "../../../../models/cart.model";

@Component({
    selector: 'cart-summary',
    standalone: true,
    imports: [],
    templateUrl: './summary.component.html'
})
export class CartSummaryComponent {
    @Input() cart: Cart | null = null;

    getSubtotal() {
        if (!this.cart || !this.cart.items) return 0;
        return this.cart.items.reduce((acc, item) => {
            const price = item.priceSnapshot || item.product.price;
            return acc + (price * item.quantity);
        }, 0);
    }

    getDiscount() {
        // Placeholder: Backend doesn't return discount yet.
        return 0;
    }

    getTax() {
        // Placeholder: Backend doesn't return tax yet.
        return 0;
    }

    getTotal() {
        return this.cart?.total || 0;
    }
}