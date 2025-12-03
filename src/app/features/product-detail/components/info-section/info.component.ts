import { Component, Input } from "@angular/core";
import { HeartIcon, LucideAngularModule, ShoppingCartIcon } from "lucide-angular";
import { ProductMediaComponent } from "../media-section/media.component";
import { SingleProductResponse } from "../../../../models/product.model";

@Component({
    selector: 'product-info-section',
    standalone: true,
    imports: [LucideAngularModule, ProductMediaComponent],
    templateUrl: './info.component.html'
})
export class ProductInfoComponent {
    CartIcon = ShoppingCartIcon;
    HeartIcon = HeartIcon;

    sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    selectedSize = 'S';
    setSelectctedSize = (i: number) => this.selectedSize = this.sizes[i]

    @Input() product: SingleProductResponse | null = null;


}