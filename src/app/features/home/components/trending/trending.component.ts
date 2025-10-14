import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { LucideAngularModule, ShoppingBagIcon } from "lucide-angular";

@Component({
    selector: 'home-trending',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './trending.component.html'
})
export class TrendingComponent { 
    trendings = [1,2,3,4,5,6,7,8];
    ShoppingBagIcon = ShoppingBagIcon;
};