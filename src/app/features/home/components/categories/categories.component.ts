import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: 'home-category',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './categories.component.html'
})
export class CategoryComponent { 
    categories = [1,2,3,4,5]
}