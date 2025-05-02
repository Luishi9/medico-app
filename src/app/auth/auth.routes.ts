import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthIntroComponent } from './auth-intro/auth-intro.component';

// Define las rutas especificas del area de autenticacion
export const authRoutes: Routes = [

    { path: '', component: AuthIntroComponent, title: 'Introducción' },
    { path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },
    //{ path: 'registro-doctor', component: RegisterComponent },
]