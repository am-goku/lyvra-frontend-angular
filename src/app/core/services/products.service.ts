import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, shareReplay, tap, throwError } from "rxjs";
import { SingleProductResponse } from "../../models/product.model";
import { LoggerService } from "./logger.service";

@Injectable({ providedIn: "root" })
export class ProductService {
    private http = inject(HttpClient);
    private logger = inject(LoggerService);
    private cache = new Map<string, Observable<any>>();

    /**
     * Create a new product (Admin only)
     * Clears cache after creation
     */
    createProduct(data: FormData): Observable<any> {
        return this.http.post('products', data).pipe(
            tap(() => {
                this.clearCache();
                this.logger.info('Product created successfully');
            }),
            catchError((error) => {
                this.logger.error('Failed to create product', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Get all products with optional category filter
     * Results are cached to reduce API calls
     */
    getProducts(categoryIds?: string[]): Observable<any> {
        const key = categoryIds?.join(',') || 'all';

        if (!this.cache.has(key)) {
            const url = categoryIds && categoryIds.length > 0
                ? `products?categoryIds=${categoryIds.join(',')}`
                : 'products';

            this.cache.set(key,
                this.http.get(url).pipe(
                    tap(() => this.logger.debug('Products fetched', { categoryIds })),
                    shareReplay({ bufferSize: 1, refCount: true }),
                    catchError((error) => {
                        this.logger.error('Failed to fetch products', error);
                        this.cache.delete(key); // Remove from cache on error
                        return throwError(() => error);
                    })
                )
            );
        }

        return this.cache.get(key)!;
    }

    /**
     * Get a single product by ID
     * Results are cached
     */
    getProductById(productId: number): Observable<SingleProductResponse> {
        const key = `product-${productId}`;

        if (!this.cache.has(key)) {
            this.cache.set(key,
                this.http.get<SingleProductResponse>(`products/${productId}`).pipe(
                    tap(() => this.logger.debug('Product fetched', { productId })),
                    shareReplay({ bufferSize: 1, refCount: true }),
                    catchError((error) => {
                        this.logger.error('Failed to fetch product', error);
                        this.cache.delete(key); // Remove from cache on error
                        return throwError(() => error);
                    })
                )
            );
        }

        return this.cache.get(key)! as Observable<SingleProductResponse>;
    }

    updateProduct(id: number, data: FormData | any): Observable<any> {
        return this.http.patch(`products/${id}`, data).pipe(
            tap(() => {
                this.clearCache();
                this.logger.info('Product updated', { id });
            }),
            catchError((error) => {
                this.logger.error('Failed to update product', error);
                return throwError(() => error);
            })
        );
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`products/${id}`).pipe(
            tap(() => {
                this.clearCache();
                this.logger.info('Product deleted', { id });
            }),
            catchError((error) => {
                this.logger.error('Failed to delete product', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Clear all cached products
     * Call this after creating, updating, or deleting products
     */
    clearCache(): void {
        this.cache.clear();
        this.logger.debug('Product cache cleared');
    }
}