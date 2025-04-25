
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  usuario: string = '';
  contrasena: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {

    this.authService.login(this.usuario, this.contrasena).subscribe((res: any) => {
      if (res.success) {
        alert(res.message);

        this.router.navigate(['/inicio']);
      } else {
        alert(res.message);
      }
    }, error => {
      console.error('Error de conexio', error);
      alert('Hubo un problema a conectar con el servidor');
    });
  }

}
