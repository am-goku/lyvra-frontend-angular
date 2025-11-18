import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category } from "../../models/category.model";

@Injectable({ providedIn: "root" })
export class CategoryService {
    constructor(private readonly http: HttpClient) { };

    getCategories() {
        return this.http.get<Category[]>('categories');
    }

    getCategoryById(id: number) {
        return this.http.get<Category>(`categories/${id}`);
    }

    createCategory(data: FormData) {
        // Only passing name as per backend requirement
        return this.http.post<Category>('categories', data);
    }

    deleteCategory(id: number) {
        return this.http.delete(`categories/${id}`);
    }
}