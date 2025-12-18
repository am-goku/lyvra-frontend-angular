import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { CartItemListComponent } from './components/list-section/list.component';
import { CartSummaryComponent } from './components/summary-section/summary.component';
import { CartSuggestionComponent } from './components/suggestion-section/suggestion.component';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from "@angular/router";
import { NotificationService } from '../../core/services/notification.service';
import { LoggerService } from '../../core/services/logger.service';

import { CommonModule } from "@angular/common";
import { LucideAngularModule, Loader2Icon, ShoppingBagIcon } from "lucide-angular";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItemListComponent, CartSummaryComponent, CartSuggestionComponent, RouterLink, LucideAngularModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private cartService = inject(CartService);
  private notification = inject(NotificationService);
  private logger = inject(LoggerService);
  private destroyRef = inject(DestroyRef);

  loader2 = Loader2Icon;
  shoppingBag = ShoppingBagIcon;

  cart = signal<Cart | null>(null);
  isLoading = signal(false);
  processingItemId = signal<number | null>(null);
  isCheckingOut = signal(false);

  constructor() {
    this.loadCart();
  }

  /**
   * Load cart from backend
   */
  loadCart(): void {
    this.isLoading.set(true);

    this.cartService.getCart()
      .subscribe({
        next: (cart) => {
          this.cart.set(cart);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.logger.error('Failed to load cart', err);
        }
      });
  }

  /**
   * Remove item from cart
   * @param itemId - Cart Item ID to remove
   */
  removeItem(itemId: number): void {
    if (this.processingItemId()) return; // Prevent double clicks
    this.processingItemId.set(itemId);

    this.cartService.removeFromCart(itemId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.processingItemId.set(null))
      )
      .subscribe({
        next: (updatedCart) => {
          this.cart.set(updatedCart);
          this.notification.success('Item removed from cart');
        },
        error: (err) => {
          this.logger.error('Failed to remove item from cart', err);
          this.notification.error('Failed to remove item. Please try again.');
        }
      });
  }

  /**
   * Decrease item quantity by 1
   * @param itemId - Cart Item ID
   */
  decreaseQty(itemId: number): void {
    if (this.processingItemId()) return;
    this.processingItemId.set(itemId);

    this.cartService.decrementQuantity(itemId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.processingItemId.set(null))
      )
      .subscribe({
        next: (updatedCart) => {
          this.cart.set(updatedCart);
          this.logger.debug('Quantity decreased', { itemId });
        },
        error: (err) => {
          this.logger.error('Failed to decrease quantity', err);
          this.notification.error('Failed to update quantity. Please try again.');
        }
      });
  }

  /**
   * Increase item quantity by 1
   * @param itemId - Cart Item ID
   */
  increaseQty(itemId: number): void {
    if (this.processingItemId()) return;
    this.processingItemId.set(itemId);

    this.cartService.incrementQuantity(itemId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.processingItemId.set(null))
      )
      .subscribe({
        next: (updatedCart) => {
          this.cart.set(updatedCart);
          this.logger.debug('Quantity increased', { itemId });
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
        },
        error: (err) => {
          this.logger.error('Failed to clear cart', err);
          this.notification.error('Failed to clear cart. Please try again.');
        }
      });
  }

  /**
   * Mock checkout process
   */
  onCheckout(): void {
    if (this.isCheckingOut()) return;

    this.isCheckingOut.set(true);

    // Simulate API delay
    setTimeout(() => {
      this.isCheckingOut.set(false);
      this.notification.success('Order placed successfully! (Mock)');

      // Optional: clear cart locally to simulate successful order
      // this.cart.set(null); // Or keep it to let them play more
    }, 2500);
  }
}
