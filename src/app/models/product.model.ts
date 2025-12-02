export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    images: { url: string }[];
    createdAt: string;
    updatedAt: string;
}