import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth.guard'; // Importa el AuthGuard
import { authRoutes } from './auth/auth.routes';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component'; // Importa el componente de diseño de autenticación
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component'; // Importa el componente de diseño principal
export const routes: Routes = [
    
    {
        path: '', // la ruta padre para este grupo peude ser '' (raiz) o 'auth' (si tienes un modulo de autenticacion)
        component: AuthLayoutComponent,
        children: authRoutes, // Descompone las rutas de autenticación aquí

    },
    { // grupo de rutas protegidas 
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard], // Protege la ruta con el AuthGuard
        children: [
            { path: 'inicio', component: InicioComponent },

            { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a la página de inicio de sesión por defecto
        ]
    },
    
    { path: '**', redirectTo: '/login' } // O a la ruta vacía si el auth layout está en la raíz


];
