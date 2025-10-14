import { Component } from "@angular/core";
import { LucideAngularModule, ShoppingBagIcon } from "lucide-angular";

@Component({
    selector: 'home-gender',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './gender.component.html'
})
export class GenderComponent {
    menList = [1,2,3,4,5,6]
    womenList = [1,2,3,4,5,6]
    kidsList = [1,2,3,4,5,6]

    ShoppingBagIcon = ShoppingBagIcon;
}