import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";

@Component({
    selector: 'app-user-layout',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent],
    templateUrl: './user-layout.component.html',
    styleUrls: ['./user-layout.component.scss']
})

export class UserLayoutComponent { };