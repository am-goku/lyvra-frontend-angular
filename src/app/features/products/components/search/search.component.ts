import { Component } from "@angular/core";
import { LucideAngularModule, SearchIcon, SendIcon } from "lucide-angular";

@Component({
    selector: 'products-search',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './search.component.html'
})
export class SearchComponent {
    SendIcon = SendIcon;
    SearchIcon = SearchIcon;
};