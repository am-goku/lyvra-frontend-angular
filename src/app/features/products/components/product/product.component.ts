import { Component, Input } from "@angular/core";
import { HeartIcon, LucideAngularModule, ShoppingBagIcon } from "lucide-angular";

@Component({
    selector: 'product-card',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './product.component.html'
})
export class ProductCard {
    ShoppingBagIcon = ShoppingBagIcon;
    HeartIcon = HeartIcon;

    @Input() i: number = 0;
};