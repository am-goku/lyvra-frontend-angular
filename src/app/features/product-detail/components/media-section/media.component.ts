import { Component, Input } from "@angular/core";
import { LucideAngularModule } from "lucide-angular";
import { ProductImage } from "../../../../models/product.model";

@Component({
    selector: 'product-media-section',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './media.component.html'
})

export class ProductMediaComponent {

    @Input() media: ProductImage[] | undefined = [];

    selectedThumbIndex: number = 0;

    setSelectedThumbIndex = (t: number) => this.selectedThumbIndex = t;
}