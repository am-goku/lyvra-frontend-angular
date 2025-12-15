import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartItemListComponent } from './components/list-section/list.component';
import { CartSummaryComponent } from './components/summary-section/summary.component';
import { CartSuggestionComponent } from './components/suggestion-section/suggestion.component';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from "@angular/router";
import { NotificationService } from '../../core/services/notification.service';
import { LoggerService } from '../../core/services/logger.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemListComponent, CartSummaryComponent, CartSuggestionComponent, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private notification = inject(NotificationService);
  private logger = inject(LoggerService);
  private destroyRef = inject(DestroyRef);

  cart = signal<Cart | null>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadCart();
  }

  /**
   * Load cart from backend
   */
  private loadCart(): void {
    this.isLoading.set(true);

    this.cartService.getCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cart) => {
          this.cart.set(cart);
          this.isLoading.set(false);
          this.logger.debug('Cart loaded', { itemCount: cart.items.length });
        },
        error: (err) => {
          this.isLoading.set(false);
          this.logger.error('Failed to load cart', err);
          this.notification.error('Failed to load cart. Please try again.');
        }
      });
  }

  /**
   * Remove item from cart
   * @param productId - Product ID to remove
   */
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedCart) => {
          this.cart.set(updatedCart);
          this.notification.success('Item removed from cart');
          this.logger.info('Item removed from cart', { productId });
        },
        error: (err) => {
          this.logger.error('Failed to remove item from cart', err);
          this.notification.error('Failed to remove item. Please try again.');
        }
      });
  }

  /**
   * Decrease item quantity by 1
   * @param productId - Product ID
   */
  decreaseQty(productId: number): void {
    this.cartService.decrementQuantity(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedCart) => {
          this.cart.set(updatedCart);
          this.logger.debug('Quantity decreased', { productId });
        },
        error: (err) => {
          this.logger.error('Failed to decrease quantity', err);
          this.notification.error('Failed to update quantity. Please try again.');
        }
      });
  }

  /**
   * Increase item quantity by 1
   * @param productId - Product ID
   */
  increaseQty(productId: number): void {
    this.cartService.incrementQuantity(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedCart) => {
          this.cart.set(updatedCart);
          this.logger.debug('Quantity increased', { productId });
        },
        error: (err) => {
          this.logger.error('Failed to increase quantity', err);
          this.notification.error('Failed to update quantity. Please try again.');
        }
      });
  }

  /**
   * Clear all items from cart
   */
  clearCart(): void {
    if (!confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    this.cartService.clearCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.cart.set(null);
          this.notification.success('Cart cleared');
          this.logger.info('Cart cleared');
        },
        error: (err) => {
          this.logger.error('Failed to clear cart', err);
          this.notification.error('Failed to clear cart. Please try again.');
        }
      });
  }
}
