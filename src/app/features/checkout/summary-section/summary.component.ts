import { Component } from "@angular/core";

@Component({
    selector: 'checkout-order-summary',
    standalone: true,
    imports: [],
    templateUrl: './summary.component.html'
})
export class CheckoutOrderSummaryComponent {
    //-----------------------//
    //--> PAYMENT-METHOD <--//
    //---------------------//
    paymentMethods = [
        { id: 1, name: 'Credit / Debit Card', icon: 'credit-card' },
        { id: 2, name: 'UPI / Wallet', icon: 'credit-card' },
        { id: 3, name: 'Cash on Delivery', icon: 'credit-card' },
    ];
    selectedPayment = 1; // From payment method

    deliveryOptions = [
        { id: 1, name: 'Standard Delivery', eta: '3-5 business days', cost: 50 },
        { id: 2, name: 'Express Delivery', eta: '1-2 business days', cost: 150 },
        { id: 3, name: 'Overnight Delivery', eta: 'Next day delivery', cost: 300 },
    ];
    selectedDelivery = 1;

    //---------------------//
    //---> CART-ITEMS <---//
    //-------------------//
    cartItems = [
        { id: 1, name: 'Floral Maxi Dress', size: 'M', color: 'Red', price: 1299, quantity: 1 },
        { id: 2, name: 'Casual Denim Jacket', size: 'L', color: 'Blue', price: 1599, quantity: 2 },
        { id: 3, name: 'Men’s Polo T-Shirt', size: 'S', color: 'White', price: 899, quantity: 1 },
    ]; //From Cart

    getSubtotal() {
        return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    getDiscount() {
        return Math.round(this.getSubtotal() * 0.05); // example 5% discount
    }

    getDeliveryCost() {
        // Assume delivery cost based on selected option
        return this.deliveryOptions.find(d => d.id === this.selectedDelivery)?.cost || 0;
    }

    getTax() {
        return Math.round((this.getSubtotal() - this.getDiscount()) * 0.12); // 12% GST
    }

    getTotal() {
        return this.getSubtotal() - this.getDiscount() + this.getTax() + this.getDeliveryCost();
    }

    placeOrder() {
        console.log('Order placed:', {
            // shipping: this.shipping,
            paymentMethod: this.selectedPayment,
            items: this.cartItems,
            total: this.getTotal(),
        });
    }

};