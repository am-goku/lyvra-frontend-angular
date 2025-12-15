import { Component, EventEmitter, Output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule, CreditCardIcon, WalletIcon, BanknoteIcon } from "lucide-angular";

@Component({
    selector: 'checkout-payment-method',
    standalone: true,
    imports: [FormsModule, LucideAngularModule],
    templateUrl: './payment.component.html'
})
export class CheckoutPaymentMethodComponent {
    @Output() paymentMethodSelected = new EventEmitter<string>();

    CreditCardIcon = CreditCardIcon;
    WalletIcon = WalletIcon;
    BanknoteIcon = BanknoteIcon;

    paymentMethods = [
        { id: 'STRIPE', name: 'Credit / Debit Card', icon: CreditCardIcon },
        { id: 'RAZORPAY', name: 'UPI / Wallet', icon: WalletIcon },
        { id: 'COD', name: 'Cash on Delivery', icon: BanknoteIcon },
    ];

    selectedPayment = signal('COD');

    selectPayment(method: string) {
        this.selectedPayment.set(method);
        this.paymentMethodSelected.emit(method);
    }
}