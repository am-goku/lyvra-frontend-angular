import { Component, DestroyRef, Input, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Cart } from "../../../models/cart.model";
import { OrderService } from "../../../core/services/order.service";
import { NotificationService } from "../../../core/services/notification.service";
import { LoggerService } from "../../../core/services/logger.service";

@Component({
    selector: 'checkout-order-summary',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './summary.component.html'
})
export class CheckoutOrderSummaryComponent {
    private orderService = inject(OrderService);
    private router = inject(Router);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private destroyRef = inject(DestroyRef);

    @Input() cart: Cart | null = null;
    @Input() addressId: number | null = null;
    @Input() paymentMethod: string = 'COD';

    isLoading = signal(false);

    getTotal(): number {
        if (!this.cart || !this.cart.items) return 0;
        return this.cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    }

    placeOrder() {
        if (!this.cart || !this.cart.items.length) {
            this.notification.warning('Your cart is empty');
            return;
        }

        if (!this.addressId) {
            this.notification.warning('Please select a shipping address');
            return;
        }

        this.isLoading.set(true);
        this.logger.info('Placing order', {
            addressId: this.addressId,
            paymentMethod: this.paymentMethod,
            total: this.getTotal()
        });

        this.orderService.createOrder({
            addressId: this.addressId,
            paymentMethod: this.paymentMethod
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (order) => {
                    this.isLoading.set(false);
                    this.notification.success('Order placed successfully!');
                    this.logger.info('Order placed', { orderId: order.id });
                    // Navigate to success page or orders page
                    // Ideally backend clears cart, but frontend checkout flow usually redirects
                    this.router.navigate(['/']); // TODO: Create order success page
                },
                error: (err) => {
                    this.isLoading.set(false);
                    this.logger.error('Failed to place order', err);
                    this.notification.error('Failed to place order. Please try again.');
                }
            });
    }
}