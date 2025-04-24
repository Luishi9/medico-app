import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  
  imports: [
    FormsModule,
    BrowserModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  /*
  usuario: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService) { }

  login() {

    this.authService.login(this.usuario, this.contrasena).subscribe((res: any) => {
      if (res.success) {
        alert("Login correcto");
      } else {
        alert("Login incorrecto");
      }
    }, error => {
      console.error('Error de conexio', error);
      alert('Hubo un problema a conectar con el servidor');
    });
  }
    */

}
