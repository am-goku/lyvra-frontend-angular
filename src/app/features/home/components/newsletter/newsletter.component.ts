import { Component } from "@angular/core";
import { LucideAngularModule, SendIcon } from "lucide-angular";

@Component({
    selector: 'home-newsletter',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './newsletter.component.html'
})
export class NewsletterComponent { 
    SendIcon = SendIcon;
}