import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, tap, throwError } from "rxjs";
import { Cart } from "../../models/cart.model";
import { LoggerService } from "./logger.service";

@Injectable({
    providedIn: "root"
})
export class CartService {
    private http = inject(HttpClient);
    private logger = inject(LoggerService);

    /**
     * Get the current user's cart
     */
    getCart(): Observable<Cart> {
        return this.http.get<Cart>('cart').pipe(
            tap(() => this.logger.debug('Cart fetched successfully')),
            catchError((error) => {
                this.logger.error('Failed to fetch cart', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Add a product to cart or update quantity if already exists
     * @param productId - ID of the product to add
     * @param quantity - Quantity to add (default: 1)
     */
    addToCart(productId: number, quantity: number = 1): Observable<Cart> {
        return this.http.post<Cart>('cart', { productId, quantity }).pipe(
            tap(() => this.logger.info('Product added to cart', { productId, quantity })),
            catchError((error) => {
                this.logger.error('Failed to add product to cart', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Increment product quantity by 1
     * @param itemId - ID of the cart item
     */
    incrementQuantity(itemId: number): Observable<Cart> {
        return this.http.post<Cart>(`cart/item/${itemId}/increment`, {}).pipe(
            tap(() => this.logger.debug('Product quantity incremented', { itemId })),
            catchError((error) => {
                this.logger.error('Failed to increment quantity', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Decrement product quantity by 1
     * @param itemId - ID of the cart item
     */
    decrementQuantity(itemId: number): Observable<Cart> {
        return this.http.post<Cart>(`cart/item/${itemId}/decrement`, {}).pipe(
            tap(() => this.logger.debug('Product quantity decremented', { itemId })),
            catchError((error) => {
                this.logger.error('Failed to decrement quantity', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Set specific quantity for a product
     * @param itemId - ID of the cart item
     * @param quantity - New quantity
     */
    setQuantity(itemId: number, quantity: number): Observable<Cart> {
        return this.http.patch<Cart>('cart/item/quantity', { itemId, quantity }).pipe(
            tap(() => this.logger.debug('Product quantity set', { itemId, quantity })),
            catchError((error) => {
                this.logger.error('Failed to set quantity', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Remove a product from cart
     * @param itemId - ID of the cart item to remove
     */
    removeFromCart(itemId: number): Observable<Cart> {
        return this.http.delete<Cart>(`cart/item/${itemId}`).pipe(
            tap(() => this.logger.info('Product removed from cart', { itemId })),
            catchError((error) => {
                this.logger.error('Failed to remove product from cart', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Clear all items from cart
     */
    clearCart(): Observable<void> {
        return this.http.delete<void>('cart/clear').pipe(
            tap(() => this.logger.info('Cart cleared')),
            catchError((error) => {
                this.logger.error('Failed to clear cart', error);
                return throwError(() => error);
            })
        );
    }
}