import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './main-layout.component.html',
})

export class MainLayoutComponent {
    constructor() {}
}
