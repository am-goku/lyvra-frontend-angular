import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { CreditCardIcon, HeartIcon, LucideAngularModule, MapPinIcon, PackageIcon, SettingsIcon, UserIcon } from "lucide-angular";
import { AccountProfileComponent } from "./components/profile/profile.component";
import { AccountOrdersComponent } from "./components/orders/orders.component";
import { AccountPaymentsComponent } from "./components/payments/payments.component";
import { AccountAddressesComponent } from "./components/addresses/addresses.component";
import { AccountWishlistComponent } from "./components/wishlist/wishlist.component";
import { AccountSettingsComponent } from "./components/settings/settings.component";

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, AccountProfileComponent, AccountOrdersComponent, AccountPaymentsComponent, AccountAddressesComponent, AccountWishlistComponent, AccountSettingsComponent],
    templateUrl: './account.componet.html'
})
export class AccountComponent {
    activeSection: string = 'profile';

    // ICONS
    UserIcon = UserIcon;
    PackageIcon = PackageIcon;
    CreditCardIcon = CreditCardIcon;
    MapPinIcon = MapPinIcon;
    HeartIcon = HeartIcon;
    SettingsIcon = SettingsIcon;
};