import { Product } from "./product.model";

export interface Category {
    id: number;
    name: string;
    description?: string;
    active: boolean;
    createdAt: Date;
    products?: Product[];
}