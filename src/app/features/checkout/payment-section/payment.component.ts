import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CreditCardIcon, LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'checkout-payment-method',
    standalone: true,
    imports: [FormsModule, LucideAngularModule],
    templateUrl: './payment.component.html'
})
export class CheckoutPaymentMethodComponent {

    CreditCardIcon = CreditCardIcon;

    paymentMethods = [
        { id: 1, name: 'Credit / Debit Card', icon: 'credit-card' },
        { id: 2, name: 'UPI / Wallet', icon: 'credit-card' },
        { id: 3, name: 'Cash on Delivery', icon: 'credit-card' },
    ];

    selectedPayment = 1;

    cardDetails = {
        number: '',
        expiry: '',
        cvv: '',
    };

}