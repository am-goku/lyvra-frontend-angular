import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class CartService {
    constructor(private readonly http: HttpClient) { };

    addToCart(product: { productId: number, quantity: number }) {
        return this.http.post('cart', product);
    }

    addQuantity(productId: number) {
        return this.http.patch('cart/add-quantity', { productId });
    }

    minusQuantity(productId: number) {
        return this.http.patch('cart/minus-quantity', { productId });
    }

    removeFromCart(productId: number) {
        return this.http.delete(`cart/${productId}`);
    }

    clearCart() {
        return this.http.delete('cart');
    }
}