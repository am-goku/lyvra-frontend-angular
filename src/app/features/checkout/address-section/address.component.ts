import { Component, DestroyRef, EventEmitter, OnInit, Output, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Address } from "../../../models/address.model";
import { AddressService } from "../../../core/services/address.service";
import { NotificationService } from "../../../core/services/notification.service";
import { LoggerService } from "../../../core/services/logger.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LucideAngularModule, PlusIcon, MapPinIcon } from "lucide-angular";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'checkout-address',
    standalone: true,
    imports: [FormsModule, LucideAngularModule, CommonModule],
    templateUrl: './address.component.html'
})
export class CheckoutAddressComponent implements OnInit {
    private addressService = inject(AddressService);
    private notification = inject(NotificationService);
    private logger = inject(LoggerService);
    private destroyRef = inject(DestroyRef);

    @Output() addressSelected = new EventEmitter<number>();

    addresses = signal<Address[]>([]);
    selectedAddressId = signal<number | null>(null);
    isLoading = signal(false);
    showForm = signal(false);

    // Form data
    newAddress: Address = this.getEmptyAddress();

    PlusIcon = PlusIcon;
    MapPinIcon = MapPinIcon;

    ngOnInit() {
        this.loadAddresses();
    }

    loadAddresses() {
        this.isLoading.set(true);
        this.addressService.getAddresses()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (addresses) => {
                    this.addresses.set(addresses);
                    this.isLoading.set(false);

                    // Auto-select default or first address
                    if (addresses.length > 0) {
                        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
                        this.selectAddress(defaultAddr.id!);
                    } else {
                        this.showForm.set(true); // No addresses, show form
                    }
                },
                error: (err) => {
                    this.logger.error('Failed to load addresses', err);
                    this.notification.error('Failed to load addresses');
                    this.isLoading.set(false);
                }
            });
    }

    selectAddress(id: number) {
        this.selectedAddressId.set(id);
        this.addressSelected.emit(id);
    }

    toggleForm() {
        this.showForm.update(v => !v);
    }

    saveAddress() {
        // Basic validation
        if (!this.newAddress.name || !this.newAddress.phone || !this.newAddress.street || !this.newAddress.zip) {
            this.notification.warning('Please fill in all required fields');
            return;
        }

        this.isLoading.set(true);
        this.addressService.addAddress(this.newAddress)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (address) => {
                    this.addresses.update(list => [...list, address]);
                    this.selectAddress(address.id!);
                    this.showForm.set(false);
                    this.newAddress = this.getEmptyAddress();
                    this.notification.success('Address saved successfully');
                    this.isLoading.set(false);
                },
                error: (err) => {
                    this.logger.error('Failed to save address', err);
                    this.notification.error('Failed to save address');
                    this.isLoading.set(false);
                }
            });
    }

    private getEmptyAddress(): Address {
        return {
            name: '',
            email: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            isDefault: false
        };
    }
}