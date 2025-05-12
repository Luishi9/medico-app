import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number; // Fecha de expiracion en formato Unix timestamp (segundos)
  iat?: number; // Fecha de emision (segundos)
}

interface RegisterData {
  nombre: string;
  usuario: string;
  correo: string;
  password: string;
  confirmPassword: string;
  telefono: string;
  activo: boolean;
}

interface RegisterPaciente {
  curp: string;
  nombre: string;
  fechaNacimiento: string;
  sexo: string;
  domicilio: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Define la URL base de tu backend. Es buena práctica usar variables de entorno para esto.
  // En angular.json puedes configurar archivos de entorno (src/environments/environment.ts)
  private backendUrl = 'http://localhost:5000/api/auth'; // <-- Ajusta esta URL si tu backend no está en localhost:5000
  private registerEndpoint = `${this.backendUrl}/register`;
  private registerPacienteEndpoint = `${this.backendUrl}/register-paciente`;

  private tokenExpirationTimer: any; // Para guardar el ID del temporiador setTimeout

  // Opcional: Un BehaviorSubject para rastrear el estado de autenticación
  // Puede ser útil para guards o para mostrar/ocultar elementos en la UI
  private isLoggedInSubject = new BehaviorSubject<Boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Inyecta HttpClient en el constructor
  constructor(private http: HttpClient
    // Si ya no usas Firebase Auth/Database para login, remueve estas inyecciones:
    // private auth: Auth,
    // private db: Database
  ) {
    this.autoLogout();
  }

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

  // *** Método para verificar si existe un token en local storage ***
  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Devuelve true si token existe, false si es null o undefined
  }

  // *** Método para verificar si el token en local storage ya expiró ***
  private isTokenExpired(): boolean {
    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) {
      return true; // Si no hay expiración guardada, asumimos que expiró o no hay token válido
    }
    const expirationTime = parseInt(expiration, 10); // Convierte la cadena guardada a número
    return Date.now() >= expirationTime; // Compara la hora actual con la hora de expiración
  }

  // *** Inicia el temporizador para el cierre de sesión automático ***
  private startLogoutTimer(duration: number): void {
    console.log('Iniciando temporizador de logout para', duration, 'ms');
    // Asegúrate de limpiar cualquier temporizador previo antes de iniciar uno nuevo
    this.clearLogoutTimer();
    this.tokenExpirationTimer = setTimeout(() => {
      console.log('Temporizador de token expirado disparado, cerrando sesión automáticamente.');
      this.logout(); // Llama al método de cierre de sesión
    }, duration);
  }

  // *** Limpia cualquier temporizador de cierre de sesión activo ***
  private clearLogoutTimer(): void {
    console.log('Limpiando temporizador de logout.');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  // *** Método para manejar el "auto-login" o verificación al cargar la app ***
  // Se llama en el constructor del servicio
  private autoLogout(): void {
    const token = this.getToken(); // Obtiene el token (si existe)
    if (token) { // Si hay token guardado
      if (!this.isTokenExpired()) { // Y no ha expirado
        // Calcula el tiempo restante para volver a configurar el temporizador
        const expiration = localStorage.getItem('token_expiration');
        const expirationTime = parseInt(expiration!, 10); // Usamos ! porque ya verificamos que existe
        const timeUntilExpiration = expirationTime - Date.now();

        if (timeUntilExpiration > 0) {
          console.log('Token válido encontrado al cargar, tiempo restante:', timeUntilExpiration, 'ms. Configurando temporizador.');
          this.startLogoutTimer(timeUntilExpiration); // Vuelve a configurar el temporizador
          this.isLoggedInSubject.next(true); // Actualiza el estado de login a true
          // Opcional: Cargar información del usuario si la guardaste
          // const userInfo = localStorage.getItem('user_info');
          // if (userInfo) { this.userInfoSubject.next(JSON.parse(userInfo)); }
        } else {
          console.log('Token encontrado al cargar pero ya expirado.');
          this.logout(); // Si expiró, cierra sesión
        }
      } else {
        console.log('Token encontrado al cargar pero ya expirado.');
        this.logout(); // Si expiró, cierra sesión
      }
    } else {
      console.log('No se encontró token al cargar.');
      // Si no hay token, ya estamos en estado logout, pero limpia por si acaso
      this.logout(); // Asegura el estado de logout
    }
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
    if (!token) {
      return null; // Si no hay token, no hay info del usuario
    }

    try {
      // los JWT tienen 3 partes separas por '.' (Header.Payload.Signature)
      const base64Url = token.split('.')[1]; // Obtener la parte del payload
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Reemplazar caracteres para decodificar
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
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


  /**
   * Envía los datos de registro al backend para crear un nuevo usuario.
   * @param registerData Objeto con los datos del nuevo usuario.
   * @returns Un Observable con la respuesta del backend.
   */
  register(registerData: RegisterData): Observable<any> {
    // enviar la peticion POST al endpoint de registro
    return this.http.post<any>(this.registerEndpoint, registerData).pipe(
      tap(response => {
        // Opcional: Si el backend devuelve el token al registrar, puedes guardarlo aquí
        // if (response && response.token) {
        //   localStorage.setItem('authToken', response.token);
        // }
        console.log('Respuesta de registro exitoso:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en el registro (AuthService): ', error);

        // pasa el error con el mensaje del backend si esta disponible
        let errorMessage = 'Ocurrio un error al intentar registrar el usuario.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.statusText) {
          errorMessage = error.statusText;
        }

        // Retorna un Observable de error para que el componente lo maneje
        return throwError(() => new Error(errorMessage));
      })

    )
  }

  /**
   * Envía los datos de registro al backend para crear un nuevo usuario.
   * @param registerPaciente Objeto con los datos del nuevo usuario.
   * @returns Un Observable con la respuesta del backend.
   */

  registerPacientes(registerPaciente: RegisterPaciente): Observable<any> {
    // enviar la peticion POST al endpoint de registro
    return this.http.post<any>(this.registerPacienteEndpoint, registerPaciente).pipe(
      tap(response => {
        // Opcional: Si el backend devuelve el token al registrar, puedes guardarlo aquí
        // if (response && response.token) {
        //   localStorage.setItem('authToken', response.token);
        // }
        console.log('Respuesta de registro exitoso:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en el registro (AuthService): ', error);

        // pasa el error con el mensaje del backend si esta disponible
        let errorMessage = 'Ocurrio un error al intentar registrar el usuario.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.statusText) {
          errorMessage = error.statusText;
        }

        // Retorna un Observable de error para que el componente lo maneje
        return throwError(() => new Error(errorMessage));
      })

    )
  }

  // Aquí irían otros métodos relacionados con la autenticación si los necesitas,
  // como registro, restablecimiento de contraseña, etc., interactuando con tu backend.

  // Si tenías métodos de Firebase Auth aquí (como signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, etc.)
  // y tu backend los reemplaza, puedes removerlos o adaptarlos para llamar a tu backend si implementas esos endpoints.

  // Si usas Firebase para otras cosas (ej: realtime database, storage), puedes mantener esos métodos
  // e inyecciones de Firebase DB, etc., pero separando la lógica de autenticación.


}
