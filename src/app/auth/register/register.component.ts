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
  email: string = '';
  password: string = '';
  username: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  async onRegister() {
    this.errorMessage = null; // Resetear el mensaje de error

    /*
    try {
      const newUser = await this.authService.register(this.email, this.password, this.username);
      if (newUser) {
        console.log('Usuario registrado:', newUser);
        // redirigir al usuario a una pagina de inicio o dashboard
        this.router.navigate(['/inicio']);
      }
    } catch (error: any) {
      console.error('Error al registrar el usuario:', error);
      // Mostrar mensaje de error al usuario (puedes mejorar el manejo de errores)
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.errorMessage = 'El correo electrónico ya está registrado.';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'El formato del correo electrónico es inválido.';
          break;
        case 'auth/weak-password':
          this.errorMessage = 'La contraseña es demasiado débil (mínimo 6 caracteres).';
          break;
        default:
          this.errorMessage = 'Error al registrar el usuario. Inténtalo de nuevo.';
      }
    }
  */
  }
}
