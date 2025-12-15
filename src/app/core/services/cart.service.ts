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
        return this.http.post<Cart>('cart/add', { productId, quantity }).pipe(
            tap(() => this.logger.info('Product added to cart', { productId, quantity })),
            catchError((error) => {
                this.logger.error('Failed to add product to cart', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Increment product quantity by 1
     * @param productId - ID of the product
     */
    incrementQuantity(productId: number): Observable<Cart> {
        return this.http.patch<Cart>('cart/increment', { productId }).pipe(
            tap(() => this.logger.debug('Product quantity incremented', { productId })),
            catchError((error) => {
                this.logger.error('Failed to increment quantity', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Decrement product quantity by 1
     * @param productId - ID of the product
     */
    decrementQuantity(productId: number): Observable<Cart> {
        return this.http.patch<Cart>('cart/decrement', { productId }).pipe(
            tap(() => this.logger.debug('Product quantity decremented', { productId })),
            catchError((error) => {
                this.logger.error('Failed to decrement quantity', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Set specific quantity for a product
     * @param productId - ID of the product
     * @param quantity - New quantity
     */
    setQuantity(productId: number, quantity: number): Observable<Cart> {
        return this.http.patch<Cart>('cart/set', { productId, quantity }).pipe(
            tap(() => this.logger.debug('Product quantity set', { productId, quantity })),
            catchError((error) => {
                this.logger.error('Failed to set quantity', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Remove a product from cart
     * @param productId - ID of the product to remove
     */
    removeFromCart(productId: number): Observable<Cart> {
        return this.http.delete<Cart>('cart/remove', {
            body: { productId }
        }).pipe(
            tap(() => this.logger.info('Product removed from cart', { productId })),
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