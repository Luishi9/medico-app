import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-intro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth-intro.component.html',
  styleUrl: './auth-intro.component.css'
})
export class AuthIntroComponent {

}
