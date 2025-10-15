import { Component, Input } from "@angular/core";
import { HeartIcon, LucideAngularModule, TrashIcon } from "lucide-angular";

@Component({
    selector: 'cart-item',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './item.component.html'
})
export class CartItemComponent {

    HeartIcon = HeartIcon;
    TrashIcon = TrashIcon;

    @Input() item: {id: number, name: string, size: string, color: string, price: number, quantity: number} | null = null;

    @Input() decreaseQty: (id:number) => void = (id) => {};

    @Input() increaseQty: (id: number) => void = (id) => {};

    @Input() removeItem: (id: number) => void = (id) => {};
}