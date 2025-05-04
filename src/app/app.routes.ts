import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Importa el AuthGuard
import { authRoutes } from './auth/auth.routes';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component'; // Importa el componente de diseño de autenticación
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component'; // Importa el componente de diseño principal

import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './auth/register/register.component';
import { ListDocsComponent } from './layouts/main-layout/menu-items/list-docs/list-docs.component';
import { RegistrarPacienteComponent } from './layouts/main-layout/menu-items/registrar-paciente/registrar-paciente.component';

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
        children: [ // Sus rutas hijas se renderizarán en el <router-outlet> de MainLayoutComponent
            { path: 'dashboard', component: DashboardComponent },
            { path: 'registro-doctor', component: RegisterComponent },
            { path: 'list-doctores', component: ListDocsComponent },
            { path: 'registro-paciente', component: RegistrarPacienteComponent },
            { path: '', redirectTo: 'inicio', pathMatch: 'full' }, // Redirige a la página de inicio de sesión por defecto
        ]
    },
    
    { path: '**', redirectTo: '/login' } // O a la ruta vacía si el auth layout está en la raíz


];
