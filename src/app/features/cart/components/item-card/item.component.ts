import { Component, EventEmitter, Input, Output } from "@angular/core";
import { HeartIcon, LucideAngularModule, TrashIcon } from "lucide-angular";
import { CartItems } from "../../../../models/cart.model";

@Component({
    selector: 'cart-item',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './item.component.html'
})
export class CartItemComponent {
    HeartIcon = HeartIcon;
    TrashIcon = TrashIcon;

    @Input() item: CartItems | null = null;
    @Output() remove = new EventEmitter<number>();
    @Output() addQ = new EventEmitter<number>();
    @Output() minusQ = new EventEmitter<number>();

}