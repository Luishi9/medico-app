import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = 'http://localhost/consultorio-api/login.php';

  constructor(private http: HttpClient) { }

  login(usuario: string, password: string) {
    const body = { usuario, password };
    return this.http.post(this.apiURL, body);
  }
}
