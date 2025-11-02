import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CategoryService {
    constructor(private readonly http: HttpClient) { };

    getCategories() {
        return this.http.get('categories');
    }

    getCategoryById(id: number) {
        return this.http.get(`categories/${id}`);
    }

    createCategory(data: { name: string; description?: string, active: boolean }) {
        // Only passing name as per backend requirement
        return this.http.post('categories', { name: data.name });
    }

    deleteCategory(id: number) {
        return this.http.delete(`categories/${id}`);
    }
}