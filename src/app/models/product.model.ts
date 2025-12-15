import { Category } from "./category.model";

export interface ProductImage {
    _id: number;
    url: string;
    productId: number;
    public_id: string;
    asset_id: string;
    createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number; // For discount calculations
    images: ProductImage[];
    createdAt: string;
    updatedAt: string;
}

export interface SingleProductResponse extends Product {
    categories: Category[];
}