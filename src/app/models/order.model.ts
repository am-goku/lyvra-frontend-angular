import { Product } from "./product.model";

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: Product
}

export interface Order {
    id: number;
    userId: number;
    total: number;
    orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
    paymentStatus: "PAID" | "FAILED" | "PENDING" | "REFUNDED";
    paymentSessionId: string;
    paymentIntentId: string;
    paymentMethod: "STRIPE" | "COD" | "PAYPAL" | "RAZORPAY" | "OTHER";
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];
}