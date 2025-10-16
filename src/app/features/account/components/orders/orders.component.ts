import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { CircleCheckBigIcon, CircleX, Clock2Icon, EyeIcon, LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'account-orders',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './orders.component.html'
})
export class AccountOrdersComponent {
    orders = [
        {
            id: 'LYV12345',
            product: 'Floral Summer Dress',
            image: 'https://picsum.photos/200?random=1',
            date: 'Oct 5, 2025',
            quantity: 1,
            status: 'Delivered',
        },
        {
            id: 'LYV12346',
            product: 'Men’s Denim Jacket',
            image: 'https://picsum.photos/200?random=2',
            date: 'Oct 10, 2025',
            quantity: 1,
            status: 'Processing',
        },
        {
            id: 'LYV12347',
            product: 'Kids’ Sneakers',
            image: 'https://picsum.photos/200?random=3',
            date: 'Oct 12, 2025',
            quantity: 2,
            status: 'Cancelled',
        },
    ];




    //icons
    CircleCheckBigIcon = CircleCheckBigIcon;
    Clock2Icon = Clock2Icon;
    CircleX = CircleX;
    EyeIcon = EyeIcon;
};