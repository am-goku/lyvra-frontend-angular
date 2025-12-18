import { Product } from "./product.model";

export interface CartItems {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    priceSnapshot: number;
    product: Product;
}

export interface Cart {
    id: number;
    userId: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    items: CartItems[];
}