import { Component } from "@angular/core";
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'cart-suggestion',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './suggestion.component.html'
})
export class CartSuggestionComponent {
    recommendedProducts = [
        { id: 101, name: 'Summer Sandals', price: 999 },
        { id: 102, name: 'Slim Fit Jeans', price: 1699 },
        { id: 103, name: 'Printed Kurta', price: 1199 },
        { id: 104, name: 'Casual Polo Shirt', price: 899 },
        { id: 105, name: 'Floral Maxi Dress', price: 1299 },
        { id: 106, name: 'Lightweight Hoodie', price: 1499 },
    ];

};