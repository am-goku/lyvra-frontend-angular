import { Component } from "@angular/core";
import { ProductInfoComponent } from "./components/info-section/info.component";
import { ProductReviewComponent } from "./components/review-section/review.component";
import { RelatedProductComponent } from "./components/related-section/related.component";

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [ProductInfoComponent, ProductReviewComponent, RelatedProductComponent],
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})

export class ProductDetailComponent { };