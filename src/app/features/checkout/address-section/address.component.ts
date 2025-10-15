import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'checkout-address',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './address.component.html'
})
export class CheckoutAddressComponent {
    shipping = {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    };

    billingSameAsShipping = true;

};