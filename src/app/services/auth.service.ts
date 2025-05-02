import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Define la URL base de tu backend. Es buena práctica usar variables de entorno para esto.
  // En angular.json puedes configurar archivos de entorno (src/environments/environment.ts)
  private backendUrl = 'http://localhost:5000/api/auth'; // <-- Ajusta esta URL si tu backend no está en localhost:5000

  // Inyecta HttpClient en el constructor
  constructor(private http: HttpClient
    // Si ya no usas Firebase Auth/Database para login, remueve estas inyecciones:
    // private auth: Auth,
    // private db: Database
  ) { }



  /**
   * Envía las credenciales al backend para iniciar sesión.
   * @param usuario El nombre de usuario.
   * @param password La contraseña (plana).
   * @returns Un Observable con la respuesta del backend (que debería contener el token).
   */

  login(usuario: string, password: string): Observable<any> {
    // la URL completa del endpoint de login en tu backend
    const loginUrl = `${this.backendUrl}/login`;
    // El cuerpo de la petición POST debe coincidir con lo que tu backend espera (usuario y password)
    const body = { usuario, password }; // Usa los nombres de campo que espera tu backend

    // realizar la peticion POST al backend
    return this.http.post<any>(loginUrl, body).pipe(
      // usar operadores de RxJS para manejar la respuestas
      tap(response => {
        // si el login es exitoso, el backend debe devolver un token
        if (response && response.token) {
          // guardar el token en el almacenamiento local (localstorage o sessionStorage
          localStorage.setItem('authToken', response.token);
          // Opcional: Puedes guardar otros datos del usuario si el backend los devuelve en el payload del token
          // localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      }),
      catchError(error => {
        // Manejo de errores: por ejemplo, cedenciales invalidas (codigo 400)
        console.error('Error en el login:', error);
        // Puedes propagar el error o retornar un observable con un valor indcando el fallo
        throw error; // propaga el error para que el componente lo maneje
      })
    );
  }

  /**
   * Cierra la sesion del usuario
   * Elimina el token del almacenamiento local
   */

  logout(): void {
    localStorage.removeItem('authToken'); // Eliminar el token
    // localStorage.removeItem('currentUser'); // Elimina otros datos si los guardaste
    // Opcional: Si tu backend tiene un endpoint de logout para invalidar el token en el servidor, llámalo aquí
    // this.http.post(`${this.backendUrl}/logout`, {}).subscribe();
  }

  /**
   * Verifica si el suaurio esta logeado (comprobando la existencia del token)
   * @returns true si hay un token guardado, false en caso contrario.
   */
  isLoggedIn(): boolean {
    // comprueba si existe el token en el almacenamiento local
    return !!localStorage.getItem('authToken');
  }

  /**
   * Obtener el token guardado
   * @returns El token si existe, null en caso contrario.
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * obtene la informacion del payload del token JWT
   * @returns 
   */
  getUserInfo(): any | null {
    const token = this.getToken();
    if(!token){
      return null; // Si no hay token, no hay info del usuario
    }

    try {
      // los JWT tienen 3 partes separas por '.' (Header.Payload.Signature)
      const base64Url = token.split('.')[1]; // Obtener la parte del payload
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Reemplazar caracteres para decodificar
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')); // Decodificar el payload


      // Si usas jwt-decode, sería más simple:
      // const decodedPayload = jwt_decode(token);

      const decodedPayload = JSON.parse(jsonPayload); // Parseamos el string JSON del payload

      // El payload que creaste en el backend es { user: { id: ..., usuario: ..., etc. } }
      // Devolvemos el objeto 'user' dentro del payload, o el payload completo si prefieres
      return decodedPayload.user || null; // Devuelve el objeto user del payload, o null si no existe

    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.logout(); // Elimina el token si no se puede decodificar
      return null;
    }

  }

   // Aquí irían otros métodos relacionados con la autenticación si los necesitas,
  // como registro, restablecimiento de contraseña, etc., interactuando con tu backend.

  // Si tenías métodos de Firebase Auth aquí (como signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, etc.)
  // y tu backend los reemplaza, puedes removerlos o adaptarlos para llamar a tu backend si implementas esos endpoints.

  // Si usas Firebase para otras cosas (ej: realtime database, storage), puedes mantener esos métodos
  // e inyecciones de Firebase DB, etc., pero separando la lógica de autenticación.


}
