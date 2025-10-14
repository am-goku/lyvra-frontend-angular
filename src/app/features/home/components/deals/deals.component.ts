import { Component } from "@angular/core";
import { LucideAngularModule, ShoppingBagIcon } from "lucide-angular";

@Component({
    selector: 'home-deals',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './deals.component.html'
})
export class DealComponent { 
    deals = [1,2,3,4,5,6];
    ShoppingBagIcon = ShoppingBagIcon;
}