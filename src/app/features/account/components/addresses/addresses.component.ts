import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule, MapPinOffIcon, PenLine, PlusIcon, StarIcon, Trash2Icon } from "lucide-angular";

@Component({
    selector: 'account-addresses',
    standalone: true,
    imports: [FormsModule, LucideAngularModule],
    templateUrl: './addresses.component.html'
})
export class AccountAddressesComponent {
    isAdding = false;

    newAddress = {
        fullName: '',
        phone: '',
        street: '',
        city: '',
        postalCode: ''
    };

    addresses = [
        {
            id: 1,
            fullName: 'Ava Williams',
            phone: '+91 9876543210',
            street: '221B Baker Street',
            city: 'Mumbai',
            postalCode: '400001',
            default: true
        },
        {
            id: 2,
            fullName: 'Ava Williams',
            phone: '+91 9876543210',
            street: '12 Rosewood Avenue',
            city: 'Pune',
            postalCode: '411001',
            default: false
        }
    ];

    saveAddress() { };
    editAddress(id: number) { };
    deleteAddress(id: number) { };

    //icons
    PlusIcon = PlusIcon;
    Edit3Icon = PenLine;
    Trash2Icon = Trash2Icon;
    StarIcon = StarIcon;
    MapPinOffIcon = MapPinOffIcon;
};