import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  nombre: string = '';
  usuario: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  async onRegister() {
    this.errorMessage = null; // Resetear el mensaje de error
    this.successMessage = null;

    // **** validacion frontend ****
    if (!this.nombre || !this.usuario || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return; // Detiene la ejecución si falta algún campo
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coninciden.';
      return; // detiene la ejecucion si dalta algun campo
    }

    // si la validacion pasa, prepara los datos para enviar
    const registerData = {
      nombre: this.nombre,
      usuario: this.usuario,
      password: this.password,
      confirmPassword: this.confirmPassword,
      id_perfil: 1,
      activo: true,
    };

    // Llama a la funcion de registro del servicio
    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        this.successMessage = 'Usuario registrado exitosamente. Ya puede iniciar sesion.';

        // Opcional: Redirigir automáticamente al login después de unos segundos
        // setTimeout(() => {
        //    this.router.navigate(['/login']);
        // }, 3000); // Redirige después de 3 segundos
        // this.router.navigate(['/login']); // O redirige inmediatamente

      },
      error: (error) => {
        console.error('Error en el componente de registro: ', error.message);
        this.errorMessage = error.message;// Muestra el mensaje de error (del backend o genérico)
      }
    })


  }
}
