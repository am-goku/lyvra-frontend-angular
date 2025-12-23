import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class CheckoutService {
    constructor(private readonly http: HttpClient) { };

    getCheckoutDetails() {
        return this.http.get('checkout');
    }
}