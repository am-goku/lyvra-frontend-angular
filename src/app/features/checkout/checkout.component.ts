import { Component, DestroyRef, OnInit, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CheckoutDeliveryComponent } from "./delivery-section/delivery.component";
import { CheckoutPaymentMethodComponent } from "./payment-section/payment.component";
import { CheckoutOrderSummaryComponent } from "./summary-section/summary.component";
import { CheckoutAddressComponent } from "./address-section/address.component";
import { CartService } from "../../core/services/cart.service";
import { Cart } from "../../models/cart.model";
import { NotificationService } from "../../core/services/notification.service";
import { LoggerService } from "../../core/services/logger.service";

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CheckoutDeliveryComponent, CheckoutPaymentMethodComponent, CheckoutOrderSummaryComponent, CheckoutAddressComponent],
    templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
    private cartService = inject(CartService);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private destroyRef = inject(DestroyRef);

    cart = signal<Cart | null>(null);
    selectedAddressId = signal<number | null>(null);
    selectedPaymentMethod = signal<string>('COD');

    ngOnInit() {
        this.loadCart();
    }

    loadCart() {
        this.cartService.getCart()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (cart) => {
                    this.cart.set(cart);
                    this.logger.debug('Checkout loaded cart', { itemCount: cart.items.length });
                },
                error: (err) => {
                    this.logger.error('Failed to load cart for checkout', err);
                    this.notification.error('Failed to load cart');
                }
            });
    }

    onAddressSelected(addressId: number) {
        this.logger.debug('Address selected', { addressId });
        this.selectedAddressId.set(addressId);
    }

    onPaymentMethodSelected(method: string) {
        this.logger.debug('Payment method selected', { method });
        this.selectedPaymentMethod.set(method);
    }
}