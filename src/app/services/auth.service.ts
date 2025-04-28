import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  expires?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = 'http://plpweb.infy.uk/consultorio-api/login.php';

  constructor(private http: HttpClient) { }

  // llamar al login.php y recibe el token en la respuesta
  login(usuario: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiURL, {usuario, password});
  }

  // guardar el JWT en localStorage
  saveToken(token: string): void {
    localStorage.setItem('jwt', token);
  }

  // recuperar el JWT
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  // borrar el token al hacer logout
  logout(): void {
    localStorage.removeItem('jwt');
    console.log('Token eliminado');
  }

  // indica si hay un token presente
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  
}
