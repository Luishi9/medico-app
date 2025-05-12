import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../../../services/paciente.service';
import { Router } from '@angular/router';
import { initModals, initDropdowns, initTabs, initFlowbite, initDatepickers } from 'flowbite';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './list-pacientes.component.html',
  styleUrl: './list-pacientes.component.css'
})

export class ListPacientesComponent implements OnInit, AfterViewInit {

  pacientes: Paciente[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;
  errorMessageEdit: string | null = null;

  selectedPaciente: Paciente | null = null;// *** Propiedad para guardar el paciente seleccionado ***
  editingPaciente: Paciente | null = null;// *** Propiedad para guardar el paciente que se esta editando

  constructor(private pacienteService: PacienteService, private router: Router) { }

  ngOnInit(): void {
    this.getPacientes(); // Llama al método para obtener usuarios al inicializar el componente
  }

  // --- Inicialización de Flowbite para elementos que existen en la vista ESTÁTICA ---
  // Si tienes elementos de Flowbite en el template que NO están dentro del *ngFor
  // o *ngIf que dependen de los datos asíncronos (ej: un dropdown en el encabezado),
  // puedes inicializarlos aquí. Para los modales/botones de la lista, no es suficiente.
  ngAfterViewInit() {
    console.log('ListPacientesComponent ngAfterViewInit - Vista inicializada.');
    // ELIMINA initModals() de aquí, ya se inicializarán después de cargar los datos.
    // initModals(); // <--- ELIMINA ESTA LÍNEA
    // Si tienes otros componentes estáticos (dropdowns, tabs), inicialízalos aquí si es necesario:
    // initDropdowns(); // Ejemplo si hay un dropdown estático
    // initTabs(); // Ejemplo si hay tabs estáticos
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

            initModals(); // <--- Inicializa modales (si hay modales en este template)
            initDatepickers();
            initTabs();// Si hay tabs dentro del *ngFor

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

  // *** Metodo para abrir el modal de edicion ***
  openEditModal(paciente: Paciente): void {
    // crea una COPIA profunda del paciente para editar
    this.editingPaciente = { ...paciente };

    setTimeout(() => {
      try {
        console.log('Re-inicializando Flowbite (Modals, Datepickers) después de establecer editingPaciente...');
        // Re-inicializa Modals: Crucial para que el botón data-modal-hide funcione si está dentro del *ngIf
        //initModals(); // <--- Manten esta re-inicialización de modales
        // Inicializa Datepickers: Crucial para el input del datepicker en el formulario de edición
        initDatepickers();

      } catch (e: any) {
        console.error('Error durante la inicialización de Flowbite DESPUÉS del setTimeout(0):', e);
        console.error('Mensaje de error:', e.message);
      }
    }, 50); // <--- Retraso de 0ms

  }

  // *** Metodo para guardar los cambios del paciente editado
  saveEditedPaciente(): void {
    //Asegurate de que editingPaciente no es null antes de intentar guardar
    if (!this.editingPaciente || this.editingPaciente.id_paciente === undefined) {
      console.error('No hay paciente seleccionado para editar o falta ID.');
      this.errorMessageEdit = 'Error al intentar guardar: no se selecciono un paciente';
      // Opcional: Cerrar el modal de edición
      // Necesitarías obtener la instancia del modal para cerrarlo programáticamente si no quieres que se cierre solo al enviar el formulario.
      // Por ahora, nos enfocamos en la lógica de guardado.
      return;
    }

    this.loading = true;
    this.errorMessageEdit = null;

    const pacienteId = this.editingPaciente.id_paciente;
    const updatedData = this.editingPaciente;

    // Llamar al servicio para enviar los datos actualizados al backend
    this.pacienteService.updatePaciente(pacienteId, updatedData).subscribe({
      next: (response) => {
        this.getPacientes();

        // Opcional: Cerrar el modal de edición programáticamente después de guardar
        // Necesitarías obtener la instancia del modal para llamarlo aquí.
        // Si el modal se cierra solo al enviar el formulario (comportamiento por defecto de algunos navegadores si es type="submit" sin preventDefault), eso está bien.
        // Si no, puedes añadir lógica para cerrar aquí si tienes la instancia (ver notas anteriores sobre cómo obtener la instancia).
        // Por ejemplo, si guardaste la instancia en this.editModalInstance:
        // if (this.editModalInstance) { this.editModalInstance.hide(); }
        // También limpia editingPaciente después de guardar y posiblemente cerrar el modal.
        this.editingPaciente = null;
      },
      error: (error) => {
        console.error('Error al actualizar paciente: ', error);
        this.errorMessageEdit = error.message;
        this.loading = false;
      }
    })

  }

}
