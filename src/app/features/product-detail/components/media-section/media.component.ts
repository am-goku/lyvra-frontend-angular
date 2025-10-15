import { Component } from "@angular/core";
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'product-media-section',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './media.component.html'
})

export class ProductMediaComponent {
    thumbnails = [1, 2, 3, 4, 5];
    selectedThumb = 1;

    setSelectedThumb = (t: number) => this.selectedThumb = t;
}