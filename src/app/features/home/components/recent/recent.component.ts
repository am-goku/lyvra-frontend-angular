import { Component } from "@angular/core";
import { LucideAngularModule, ShoppingBagIcon } from "lucide-angular";

@Component({
    selector: 'home-recent',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './recent.component.html'
})
export class RecentComponent { 
    recents = [1,2,3,4,5,6];
    ShoppingBadIcon = ShoppingBagIcon;
}