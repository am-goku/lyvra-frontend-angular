import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class CheckoutService {
    constructor(private readonly http: HttpClient) { };

    checkout() {
        return this.http.post('checkout', {});
    }
}