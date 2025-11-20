import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ProductService {
    constructor(private readonly http: HttpClient) { };

    createProduct(data: FormData) {
        return this.http.post('products', data);
    }

    getProducts(categoryIds?: string[]) {
        return this.http.get(`products?${categoryIds && "categoryIds=" + categoryIds}`);
    }

}