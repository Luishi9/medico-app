import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'inicio', component: InicioComponent },
];
