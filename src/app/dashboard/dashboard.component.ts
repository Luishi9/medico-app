import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { initDropdowns, initFlowbite } from 'flowbite';

interface UserInfo {
  id: number;
  usuario: string;
  nombre: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  userInfo: UserInfo | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
    // Inicializa los dropdowns de Flowbite después de que la vista se haya renderizado
    // Asegúrate de que Flowbite JS esté cargado globalmente o importado correctamente
     // initDropdowns(); // Si importaste initDropdowns
     // initFlowbite(); // Si importaste initFlowbite (inicializa todos los componentes)
    console.log('Inicializando dropdowns de Flowbite...'); // Verifica en consola
    // Nota: La forma exacta de inicializar depende de cómo incluiste Flowbite JS

    console.log('Dropdowns de Flowbite inicializados correctamente.');
  }

  onLogoutClick(): void {
    this.authService.logout(); // Llamar a la funcion de logout del servicio

    // redirige al usuario a la pagina de login
    this.router.navigate(['/login']);
  }

}
