import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'checkout-delivery-options',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './delivery.component.html'
})
export class CheckoutDeliveryComponent {
    deliveryOptions = [
        { id: 1, name: 'Standard Delivery', eta: '3-5 business days', cost: 50 },
        { id: 2, name: 'Express Delivery', eta: '1-2 business days', cost: 150 },
        { id: 3, name: 'Overnight Delivery', eta: 'Next day delivery', cost: 300 },
    ];

    selectedDelivery = 1;
};