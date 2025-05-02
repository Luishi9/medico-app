import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// Define las rutas especificas del area de autenticacion
export const authRoutes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'registro-doctor', component: RegisterComponent },
]