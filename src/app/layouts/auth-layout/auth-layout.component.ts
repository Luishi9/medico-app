import { Component } from "@angular/core";
import { RouterOutlet, RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-auth-layout",
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: "./auth-layout.component.html",
})

export class AuthLayoutComponent {
    constructor(public router: Router){}
}

