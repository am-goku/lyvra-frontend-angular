import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class ProductService {
    constructor (private readonly http: HttpClient) {};

    getProducts(categoryIds?: string[]) {
        return this.http.get(`products?categoryIds=${categoryIds}`);
    }
}