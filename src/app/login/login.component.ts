
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterLink ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  usuario: string = '';
  contrasena: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin(): void {
    this.errorMessage = '';

    // llama al metodo login del servicio
    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: (response) => {
        // Login exitoso, el token ya esta guardado en el servicio
        console.log('Login successful', response);
        // Rederigir al usuario a otra pagina
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        //Manejo de errores del login
        console.error('Login Failed', error);
        // Muestra un mensaje al usuario
        if (error.status === 400) {
          this.errorMessage = 'Credenciales inválidas. Verifica el usuario y contraseña.';
        } else if(error.status === 401){
          this.errorMessage = 'El usuario con el que intentas iniciar sesion esta inactivo.';
        }else {
          this.errorMessage = 'Ocurrió un error al intentar iniciar sesion.';
        }
      }
    });
  }
}