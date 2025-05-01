import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    // Inicializa los dropdowns de Flowbite después de que la vista se haya renderizado
    // Asegúrate de que Flowbite JS esté cargado globalmente o importado correctamente
     // initDropdowns(); // Si importaste initDropdowns
     // initFlowbite(); // Si importaste initFlowbite (inicializa todos los componentes)
    console.log('Inicializando dropdowns de Flowbite...'); // Verifica en consola
    // Nota: La forma exacta de inicializar depende de cómo incluiste Flowbite JS
  }

  onLogoutClick(): void {
    this.authService.logout(); // Llamar a la funcion de logout del servicio

    // redirige al usuario a la pagina de login
    this.router.navigate(['/login']);
  }

}
