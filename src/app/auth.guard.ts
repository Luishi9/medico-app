import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, GuardResult, MaybeAsync } from '@angular/router'; // Importa Router y UrlTree
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root' // Proporciona el servicio en la raíz de la aplicación
})

export class AuthGuard implements CanActivate {

  // inyecta tu authservice y router
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Usa tu authservice para verificar si el usuario esta logeado
    if (this.authService.isLoggedIn()) {
      // si esta logeado permite la activacion de la ruta 
      return true;

    } else {
      // si no etsa logeado, redirige a la pagina de login
      // y se niega a la activacion de la ruta (devuelve false o UrlTree)
      console.log('Acceso denegado. Redirigiendo a la página de inicio de sesión...');
      return this.router.createUrlTree(['/login']);
    }
  }
}
