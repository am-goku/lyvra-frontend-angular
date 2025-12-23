import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, tap, throwError } from "rxjs";
import { LoggerService } from "./logger.service";

@Injectable({
    providedIn: "root"
})
export class OrderService {
    private http = inject(HttpClient);
    private logger = inject(LoggerService);

    getOrders(): Observable<any[]> {
        return this.http.get<any[]>('orders').pipe(
            tap(orders => this.logger.debug('Orders fetched', { count: orders.length })),
            catchError(err => {
                this.logger.error('Failed to fetch orders', err);
                return throwError(() => err);
            })
        );
    }

    getOrderById(orderId: number): Observable<any> {
        return this.http.get<any>(`orders/${orderId}`).pipe(
            tap(() => this.logger.debug('Order fetched', { orderId })),
            catchError(err => {
                this.logger.error('Failed to fetch order', err);
                return throwError(() => err);
            })
        );
    }

    createOrder(data: { addressId: number, paymentMethod: string }): Observable<any> {
        return this.http.post<any>('orders', data).pipe(
            tap(order => this.logger.info('Order created successfully', { orderId: order.id })),
            catchError(err => {
                this.logger.error('Failed to create order', err);
                return throwError(() => err);
            })
        );
    }

    cancelOrder(orderId: number): Observable<void> {
        return this.http.put<void>(`orders/${orderId}/cancel`, {}).pipe(
            tap(() => this.logger.info('Order cancelled', { orderId })),
            catchError(err => {
                this.logger.error('Failed to cancel order', err);
                return throwError(() => err);
            })
        );
    }
}