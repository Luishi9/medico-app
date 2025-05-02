import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard'; // Importa el AuthGuard

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegisterComponent },
    { 
        path: 'inicio', 
        component: InicioComponent,
        canActivate: [AuthGuard], // Protege la ruta con el AuthGuard
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a la página de inicio de sesión por defecto
    { path: '**', redirectTo: '/login' } // Redirige cualquier ruta no encontrada a la página de inicio de sesión


];
