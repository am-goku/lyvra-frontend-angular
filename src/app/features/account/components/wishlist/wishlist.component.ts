import { Component } from "@angular/core";
import { HeartIcon, HeartOffIcon, LucideAngularModule, ShoppingBagIcon } from "lucide-angular";

@Component({
    selector: 'account-wishlist',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './wishlist.component.html'
})
export class AccountWishlistComponent {
    wishlist = [
        {
            id: 1,
            name: 'Floral Wrap Dress',
            category: 'Women',
            price: 2499,
            image: 'https://picsum.photos/400?random=10',
        },
        {
            id: 2,
            name: 'Denim Jacket',
            category: 'Men',
            price: 3299,
            image: 'https://picsum.photos/400?random=11',
        },
        {
            id: 3,
            name: 'Kids Cotton Hoodie',
            category: 'Kids',
            price: 1599,
            image: 'https://picsum.photos/400?random=12',
        },
    ];

    removeFromWishlist(id: number) {}
    addToCart(id: number) {}

    //Icons
    HeartOffIcon = HeartOffIcon;
    HeartIcon = HeartIcon;
    ShoppingBagIcon = ShoppingBagIcon;

};