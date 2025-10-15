import { Component } from "@angular/core";
import { EyeIcon, LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'related-product-section',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './related.component.html'
})
export class RelatedProductComponent {
    EyeIcon = EyeIcon;

    relatedProducts = [
        { id: 1, name: 'Floral Maxi Dress', price: 1299 },
        { id: 2, name: 'Casual Denim Jacket', price: 1599 },
        { id: 3, name: 'Men’s Polo T-Shirt', price: 899 },
        { id: 4, name: 'Women’s Crop Top', price: 749 },
        { id: 5, name: 'Classic Chinos', price: 1399 },
        { id: 6, name: 'Summer Sandals', price: 999 },
        { id: 7, name: 'Slim Fit Jeans', price: 1699 },
        { id: 8, name: 'Printed Kurta', price: 1199 },
    ];

};