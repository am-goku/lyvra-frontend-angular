import { Component } from "@angular/core";
import { ArrowLeft, ArrowRight, LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'product-pagination',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './pagination.component.html'
})
export class ProductPagination {
    RightArrow = ArrowRight;
    LeftArrow = ArrowLeft;
}