import { Component } from "@angular/core";
import { CheckoutDeliveryComponent } from "./delivery-section/delivery.component";
import { CheckoutPaymentMethodComponent } from "./payment-section/payment.component";
import { CheckoutOrderSummaryComponent } from "./summary-section/summary.component";
import { CheckoutAddressComponent } from "./address-section/address.component";

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CheckoutDeliveryComponent, CheckoutPaymentMethodComponent, CheckoutOrderSummaryComponent, CheckoutAddressComponent],
    templateUrl: './checkout.component.html'
})
export class CheckoutComponent { };