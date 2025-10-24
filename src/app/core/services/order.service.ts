import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class OrderService {
    constructor(private readonly http: HttpClient) { }

    getOrders() {
        return this.http.get('orders');
    }

    getOrderById(orderId: number) {
        return this.http.get(`orders/${orderId}`);
    }

    cancel(orderId: number) {
        return this.http.post('orders/cancel', { orderId });
    }
}