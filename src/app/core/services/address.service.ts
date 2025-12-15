import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, tap, throwError } from "rxjs";
import { Address } from "../../models/address.model";
import { LoggerService } from "./logger.service";

@Injectable({
    providedIn: "root"
})
export class AddressService {
    private http = inject(HttpClient);
    private logger = inject(LoggerService);

    getAddresses(): Observable<Address[]> {
        return this.http.get<Address[]>('addresses').pipe(
            tap(addresses => this.logger.debug('Addresses fetched', { count: addresses.length })),
            catchError(err => {
                this.logger.error('Failed to fetch addresses', err);
                return throwError(() => err);
            })
        );
    }

    addAddress(address: Address): Observable<Address> {
        return this.http.post<Address>('addresses', address).pipe(
            tap(newAddr => this.logger.info('Address added', { id: newAddr.id })),
            catchError(err => {
                this.logger.error('Failed to add address', err);
                return throwError(() => err);
            })
        );
    }

    updateAddress(id: number, address: Partial<Address>): Observable<Address> {
        return this.http.patch<Address>(`addresses/${id}`, address).pipe(
            tap(() => this.logger.info('Address updated', { id })),
            catchError(err => {
                this.logger.error('Failed to update address', err);
                return throwError(() => err);
            })
        );
    }

    deleteAddress(id: number): Observable<void> {
        return this.http.delete<void>(`addresses/${id}`).pipe(
            tap(() => this.logger.info('Address deleted', { id })),
            catchError(err => {
                this.logger.error('Failed to delete address', err);
                return throwError(() => err);
            })
        );
    }
}
