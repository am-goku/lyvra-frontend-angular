import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule, PenLineIcon } from "lucide-angular";

@Component({
    selector: 'account-profile',
    standalone: true,
    imports: [FormsModule, LucideAngularModule],
    templateUrl: './profile.component.html'
})
export class AccountProfileComponent {
    userName = 'Ava Williams';
    userEmail = 'ava.williams@example.com';
    userPhone = '+91 9876543210';
    userLocation = 'Mumbai, India';
    isEditing = false;

    //Icons
    EditIcon = PenLineIcon;
};