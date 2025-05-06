import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../../services/paciente.service';
import { Router } from '@angular/router';
import { initModals, initDropdowns, initTabs } from 'flowbite';

interface Paciente {
  id_paciente: number;
  curp: string;
  nombre: string;
  fechaNacimiento: string;
  sexo: string;
  domicilio: string;
  telefono: string;
  activo: boolean;
}

@Component({
  selector: 'app-list-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-pacientes.component.html',
  styleUrl: './list-pacientes.component.css'
})

export class ListPacientesComponent implements OnInit, AfterViewInit {

  pacientes: Paciente[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  // *** Propiedad para guardar el paciente seleccionado ***
  selectedPaciente: Paciente | null = null;

  constructor(private pacienteService: PacienteService, private router: Router) { }

  ngOnInit(): void {
    this.getPacientes(); // Llama al método para obtener usuarios al inicializar el componente
  }

  // Si los elementos de Flowbite (modales, dropdowns, etc.) están definidos en este template,
  // la inicialización debe ocurrir después de que la vista se inicialice.
  // Si los elementos interactivos (triggers) están dentro de un *ngFor,
  // la inicialización debe esperar a que los datos carguen y el *ngFor se renderice.
  // La inicialización dentro del subscribe con setTimeout(0) (como en getUsers) es correcta
  // para elementos dentro del *ngFor. Si tienes otros elementos estáticos, también podrías
  // inicializar aquí (sin setTimeout).
  ngAfterViewInit() {
    console.log('ListPacientesComponent ngAfterViewInit - Vista inicializada.');
    // initModals(); // Si el HTML del modal está aquí y NO en el *ngFor, podrías inicializarlo aquí.
    // initDropdowns(); // Si hay dropdowns estáticos aquí.
    // initTabs(); // Si hay tabs estáticos aquí.
 }

  getPacientes(): void {
    this.loading = true; // Empieza a cargar
    this.errorMessage = null; // Limpia errores

    this.pacienteService.getAllPacientes().subscribe({
      next: (data: Paciente[]) => { // 'data' es el array de usuarios del backend

        this.pacientes = data; // Asigna los datos recibidos a la propiedad 'pacientes'

        this.loading = false; // Termina la carga

        // --- ¡Inicializa Flowbite AQUÍ después de que los datos han llegado, usando setTimeout(..., 0)! ---
        // Esto da tiempo a Angular para actualizar completamente el DOM después de *ngFor.
        console.log('Datos de usuarios recibidos. Programando inicialización de Flowbite...');
        setTimeout(() => {
          try {
            console.log('Ejecutando inicialización de Flowbite después del setTimeout(0)...');
            // Inicializa las funciones de Flowbite necesarias para los elementos en list-docs.component.html
            // initFlowbite(); // Si inicializa todos (incluyendo modales, dropdowns, tabs)
            initModals(); // <--- Inicializa modales (si hay modales en este template)
            initDropdowns(); // Si hay dropdowns en este template

            console.log('Flowbite (Modals, Dropdowns, Tabs) inicializado después de cargar los usuarios y setTimeout(0).');
          } catch (e: any) {
            console.error('Error durante la inicialización de Flowbite DESPUÉS del setTimeout(0):', e);
            console.error('Mensaje de error:', e.message);
          }
        }, 50); // <--- Retraso de 0ms



        console.log('Usuarios cargados:', this.pacientes);
      },
      error: (error) => { // Maneja errores del servicio
        console.error('Error al obtener usuarios:', error);
        this.errorMessage = error.message; // Muestra el mensaje de error
        this.loading = false; // Termina la carga
        // Opcional: Si el error es por autenticación (401), redirige al login
        // if (error.status === 401) { this.router.navigate(['/login']); }
      }
    });
  }

  // *** Metodo para seleccionar un paciente y guardarlo en la propiedad ***

  selectPaciente(paciente: Paciente): void {
    console.log('Paciente seleccionado para ver info: ', paciente);
    this.selectedPaciente = paciente;
  }

}
