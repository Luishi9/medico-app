import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';
import { initModals, initFlowbite, initDropdowns, initTabs } from 'flowbite';

interface User {
  id_usuario: number,
  nombre: string;
  usuario: string;
  correo: string;
  telefono: string
  id_perfil: number;
  activo: boolean;
}

@Component({
  selector: 'app-list-docs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-docs.component.html',
  styleUrl: './list-docs.component.css'
})
export class ListDocsComponent {

  users: User[] = []; // Array para guardar la lista de usuarios
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(private userService: UserService, private router: Router) { } // Inyecta UserService

  ngOnInit(): void {
    this.getUsers(); // Llama al método para obtener usuarios al inicializar el componente
  }

  getUsers(): void {
    this.loading = true; // Empieza a cargar
    this.errorMessage = null; // Limpia errores

    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => { // 'data' es el array de usuarios del backend
        this.users = data; // Asigna los datos recibidos a la propiedad 'users'

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
            initTabs();    // Si hay tabs en este template

            console.log('Flowbite (Modals, Dropdowns, Tabs) inicializado después de cargar los usuarios y setTimeout(0).');
          } catch (e: any) {
            console.error('Error durante la inicialización de Flowbite DESPUÉS del setTimeout(0):', e);
            console.error('Mensaje de error:', e.message);
          }
        }, 50); // <--- Retraso de 0ms


        
        console.log('Usuarios cargados:', this.users);
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

  /*
  ngAfterViewInit() {
    initFlowbite(); // Inicializa Flowbite para usar sus componentes JS
    initDropdowns(); // Inicializa los dropdowns de Flowbite
    initModals();
    initTabs();
  }
  */

}
