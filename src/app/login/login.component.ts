
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginResponse } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  usuario: string = '';
  contrasena: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.authService.login(this.usuario, this.contrasena)
      .subscribe({
        next: (res: LoginResponse) => {
          // Aquí solo entras si status HTTP es 2xx
          if (res.success && res.token) {
            this.authService.saveToken(res.token);
            alert(res.message);
            this.router.navigate(['/inicio']);
          } else {
            // En caso de que devuelvas 200 pero success=false
            alert(res.message);
          }
        },
        error: err => {
          // err.status será el código HTTP que devolvió PHP
          if (err.status === 0) {
            // No hubo conexión
            alert('No se pudo conectar al servidor');
          } else if (err.status === 401) {
            // Tu PHP devuelve 401 + { success:false, message: "..." }
            alert(err.error.message);
          } else {
            console.error('Error inesperado', err);
            alert('Ocurrió un error inesperado');
          }
        }
      });
  }
  

}
