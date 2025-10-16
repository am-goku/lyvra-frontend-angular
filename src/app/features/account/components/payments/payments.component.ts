import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CreditCardIcon, LucideAngularModule, PenLineIcon, PlusIcon, SmartphoneIcon, StarIcon, Trash2Icon } from "lucide-angular";

@Component({
    selector: 'account-payments',
    standalone: true,
    imports: [LucideAngularModule, FormsModule],
    templateUrl: './payments.component.html'
})
export class AccountPaymentsComponent {
    isAdding = false;

    newPayment = {
        holder: '',
        number: '',
        expiry: '',
        type: 'Credit',
    };

    payments = [
        {
            id: 1,
            type: 'Credit',
            last4: '3456',
            expiry: '08/27',
            default: true,
        },
        {
            id: 2,
            type: 'UPI',
            upiId: 'ava@okhdfcbank',
            default: false,
        },
    ];

    deletePayment(id: number) {};
    editPayment(id: number) {};
    savePayment() {};

    //Icons
    CreditCardIcon = CreditCardIcon;
    StarIcon = StarIcon;
    PlusIcon = PlusIcon;
    PenLineIcon = PenLineIcon;
    Trash2Icon = Trash2Icon;
    PaymentMethodIcon = (type: string) => type === 'UPI'? SmartphoneIcon: CreditCardIcon;
};