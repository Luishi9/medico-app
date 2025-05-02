import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth.guard'; // Importa el AuthGuard
import { authRoutes } from './auth/auth.routes';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component'; // Importa el componente de diseño de autenticación

export const routes: Routes = [
    
    {
        path: '', // la ruta padre para este grupo peude ser '' (raiz) o 'auth' (si tienes un modulo de autenticacion)
        component: AuthLayoutComponent,

    }
    // rutas de autenticacion en las rutas principales
    ...authRoutes, // Descompone las rutas de autenticación aquí
    
    //{ path: 'login', component: LoginComponent },
    //{ path: 'registro', component: RegisterComponent },
    { 
        path: 'inicio', 
        component: InicioComponent,
        canActivate: [AuthGuard], // Protege la ruta con el AuthGuard
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a la página de inicio de sesión por defecto
    { path: '**', redirectTo: '/login' } // Redirige cualquier ruta no encontrada a la página de inicio de sesión


];
