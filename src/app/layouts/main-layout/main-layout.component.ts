import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from "../../services/auth.service";

import { initFlowbite } from 'flowbite';

interface UserInfo {
    id: number;
    usuario: string;
    nombre: string;
}

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink],
    templateUrl: './main-layout.component.html',
})

export class MainLayoutComponent implements OnInit, AfterViewInit {

    // *** Obtiene referencias a los elementos del dropdown usando ViewChild ***
    // #dropdownRightEndButtonPacientes en el HTML
    @ViewChild('dropdownButtonPacientes') dropdownButtonEl?: ElementRef<HTMLButtonElement>;
    // #dropdownRightEndPacientes en el HTML
    @ViewChild('dropdownMenuPacientes') dropdownMenuEl?: ElementRef<HTMLDivElement>;

    @ViewChild('dropdownButtonDoctores') dropdownButtonElDoctores?: ElementRef<HTMLButtonElement>;
    @ViewChild('dropdownMenuDoctores') dropdownMenuElDoctores?: ElementRef<HTMLDivElement>;

    //private pacientesDropdownInstance: Dropdown | null = null;

    userInfo: UserInfo | null = null;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userInfo = this.authService.getUserInfo(); // Obtener información del usuario desde el servicio
        if (this.userInfo) {
            console.log('Información del usuario:', this.userInfo);
            console.log('Nombre de usurio: ', this.userInfo.usuario);
            console.log('Nombre : ', this.userInfo.nombre);

        } else {
            console.log('No se encontró información del usuario.'); // Manejo de error si no hay info del usuario
            // Redirigir a la página de login si no hay información del usuario
            //this.router.navigate(['/login']);
        }
    }

    ngAfterViewInit(): void {

        console.log('Inicializando dropdowns de Flowbite...'); // Verifica en consola

        initFlowbite(); // Inicializa Flowbite para usar sus componentes JS

        console.log('Inicialización de Flowbite en MainLayoutComponent completada.');
    }

    // *** Nuevo método para alternar (mostrar/ocultar) el dropdown ***
    togglePacientesDropdown(): void {
        console.log('Alternando estado del dropdown de Pacientes...');
        if (this.dropdownMenuEl) {
            const dropdownMenu = this.dropdownMenuEl.nativeElement;
             // *** Alterna la clase 'hidden' ***
             dropdownMenu.classList.toggle('hidden');

             // *** Alterna la clase que Flowbite usa para hacerlo visible (ej: 'block', 'flex') ***
             // Inspecciona un dropdown de Flowbite que SÍ funcione en otro lado para ver si añade 'block' o 'flex'.
             // Generalmente, toggle 'hidden' y toggle 'block' es suficiente si solo cambia entre esos dos estados.
             if (dropdownMenu.classList.contains('hidden')) {
                  // Si está oculto, quita la clase de visualización (si la tiene)
                  dropdownMenu.classList.remove('block'); // Ajusta 'block' si Flowbite usa 'flex' u otra
             } else {
                  // Si no está oculto (es decir, se acaba de mostrar), añade la clase de visualización
                  dropdownMenu.classList.add('block'); // Ajusta 'block' si Flowbite usa 'flex' u otra
             }

             console.log('Clase hidden del dropdown alternada. Estado actual hidden:', dropdownMenu.classList.contains('hidden'));
 
        } else {
            console.warn('Elemento del menú del Dropdown de Pacientes no encontrado para alternar clases.');
        }
    }

    

    // *** Método para ocultar el dropdown programáticamente ***
    hidePacientesDropdown(): void {
        console.log('Intentando ocultar el dropdown de Pacientes...');
        if (this.dropdownMenuEl) {
            const dropdownMenu = this.dropdownMenuEl.nativeElement;

            // *** Añade la clase 'hidden' ***
            dropdownMenu.classList.add('hidden');

            // *** Quita la clase de visualización (ej: 'block', 'flex') ***
            dropdownMenu.classList.remove('block'); // Ajusta 'block' si Flowbite usa 'flex' u otra

            console.log('Clase hidden del dropdown añadida.');
        } else {
            console.warn('Elemento del menú del Dropdown de Pacientes no encontrado para ocultar clases.');
        }
    }

    toggleDoctoresDropdown(): void {
        console.log('Alternando estado del dropdown de Pacientes...');
        if (this.dropdownMenuElDoctores) {
            const dropdownMenu = this.dropdownMenuElDoctores.nativeElement;
             dropdownMenu.classList.toggle('hidden');

             if (dropdownMenu.classList.contains('hidden')) {
                  dropdownMenu.classList.remove('block'); // Ajusta 'block' si Flowbite usa 'flex' u otra
             } else {
                  dropdownMenu.classList.add('block'); // Ajusta 'block' si Flowbite usa 'flex' u otra
             }
             console.log('Clase hidden del dropdown alternada. Estado actual hidden:', dropdownMenu.classList.contains('hidden'));
 
        } else {
            console.warn('Elemento del menú del Dropdown de Pacientes no encontrado para alternar clases.');
        }
    }

    // *** Método para ocultar el dropdown programáticamente ***
    hideDoctoresDropdown(): void {
        console.log('Intentando ocultar el dropdown de Pacientes...');
        if (this.dropdownMenuElDoctores) {
            const dropdownMenu = this.dropdownMenuElDoctores.nativeElement;
            dropdownMenu.classList.add('hidden');
            dropdownMenu.classList.remove('block'); // Ajusta 'block' si Flowbite usa 'flex' u otra
            console.log('Clase hidden del dropdown añadida.');
        } else {
            console.warn('Elemento del menú del Dropdown de Pacientes no encontrado para ocultar clases.');
        }
    }

    onLogoutClick(): void {
        this.authService.logout(); // Llamar a la funcion de logout del servicio
        // redirige al usuario a la pagina de login
        this.router.navigate(['/login']);
    }
}
