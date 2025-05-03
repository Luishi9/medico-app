// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Necesitas AuthService para obtener el token

// define una interfaz para la estructura de datos de usuario que esperas
interface User {
    id_usuario: number;
    nombre: string;
    usuario: string;
    correo: string;
    telefono: string;
    id_perfil: number;
    activo: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private backendBaseUrl = 'http://localhost:5000';
    private usersEndpoint = `${this.backendBaseUrl}/api/users`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    /**
     * obtiene la lista de todos los usuarios desde el back
     * @returns un observable con un array de usuario
     */
    getAllUsers(): Observable<User[]> {
        const token = this.authService.getToken();

        // crea los encabezados de la peticion, incluyendo el token de autorizacion
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // <--- Incluye el token aquí
            })
        };

        // Envia la peticion GET al endpoint de usuarios con los encabezados
        return this.http.get<User[]>(this.usersEndpoint, httpOptions).pipe(
            catchError(this.handleError) // Manejo de errores
        );
    }

    // Metodo privado para manejar errores http

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ocurrió un error desconocido.';
        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
            // Error del lado del servidor
            errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${error.message}`;
            // Puedes añadir más detalles del error si el backend los envía en error.error
            if (error.error && error.error.message) {
                errorMessage = `Error del servidor: ${error.error.message}`; // Usa el mensaje del backend
            }
        }
        console.error('Error en UserService:', errorMessage);
        // Retorna un observable con un mensaje de error amigable para el componente
        return throwError(() => new Error(errorMessage));
    }


}