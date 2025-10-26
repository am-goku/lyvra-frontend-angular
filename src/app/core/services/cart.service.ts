import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cart } from "../../models/cart.model";

@Injectable({
    providedIn: "root"
})
export class CartService {
    constructor(private readonly http: HttpClient) { };

    getCart(): Observable<Cart> {
        return this.http.get<Cart>('cart');
    }

    addToCart(product: { id: number, quantity: number }) {
        return this.http.post('cart', product);
    }

    addQuantity(id: number) {
        return this.http.patch('cart/add-quantity', { id });
    }

    minusQuantity(id: number) {
        return this.http.patch('cart/minus-quantity', { id });
    }

    removeFromCart(id: number) {
        return this.http.delete(`cart/${id}`);
    }

    clearCart() {
        return this.http.delete('cart');
    }
}