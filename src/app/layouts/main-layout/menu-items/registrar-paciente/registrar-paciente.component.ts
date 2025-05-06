import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initDatepickers } from 'flowbite';

@Component({
  selector: 'app-registrar-paciente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registrar-paciente.component.html',
  styleUrl: './registrar-paciente.component.css'
})
export class RegistrarPacienteComponent {

  curp: string = '';
  nombre: string = '';
  fechaNacimiento: string = '';
  sexo: string = '';
  domicilio: string = '';
  telefono: string = '';

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async onRegister() {
    this.errorMessage = null; // Resetear el mensaje de error
    this.successMessage = null;

    // **** validacion frontend ****
    if (!this.nombre ) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return; // Detiene la ejecución si falta algún campo
    }

    // si la validacion pasa, prepara los datos para enviar
    const registerPaciente = {
     
      curp: this.curp,
      nombre: this.nombre,
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo,
      domicilio: this.domicilio,
      telefono: this.telefono     
    };

    // Llama a la funcion de registro del servicio
    this.authService.registerPacientes(registerPaciente).subscribe({
      next: (response) => {
        //console.log('Registro exitoso', response);
        this.successMessage = 'Usuario registrado exitosamente. Ya puede iniciar sesion.';

      },
      error: (error) => {
        //console.error('Error en el componente de registro: ', error.message);
        this.errorMessage = error.message;// Muestra el mensaje de error (del backend o genérico)
      }
    })
  }

  ngAfterViewInit() {
    initDatepickers();
  }


}
