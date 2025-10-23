import { Component } from "@angular/core";
import { LucideAngularModule, SearchIcon, SlidersVertical, X } from "lucide-angular";

@Component({
    selector: 'products-filter',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './filter.component.html'
})
export class FilterComponent {
    SliderIcon = SlidersVertical;
    XIcon = X;
    SearchIcon = SearchIcon;

    isDrawerOpen = false;

    setIsDrawerOpen = () => this.isDrawerOpen = !this.isDrawerOpen
 }