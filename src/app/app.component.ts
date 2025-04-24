import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './login/login.component.html',

  /*template: `
    <h1>Medico App</h1>
    
    <app-login></app-login>
  `,
  */

  styleUrl: './login/login.component.css'
})
export class AppComponent {
  title = 'medico-app';
}
