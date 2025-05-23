// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Necesitas AuthService para obtener el token

// define una interfaz para la estructura de datos de usuario que esperas
interface Paciente {
    id_paciente: number;
    curp: string;
    nombre: string;
    fechaNacimiento: string;
    sexo: string;
    domicilio: string;
    telefono: string;
    activo: boolean
}

@Injectable({
    providedIn: 'root'
})

export class PacienteService {
    private backendBaseUrl = 'http://localhost:5000';
    private pacienteEndpoint = `${this.backendBaseUrl}/api/pacientes`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    /**
     * obtiene la lista de todos los usuarios desde el back
     * @returns un observable con un array de usuario
     */
    getAllPacientes(): Observable<Paciente[]> {
        const token = this.authService.getToken();

        // crea los encabezados de la peticion, incluyendo el token de autorizacion
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // <--- Incluye el token aquí
            })
        };

        // Envia la peticion GET al endpoint de usuarios con los encabezados
        return this.http.get<Paciente[]>(this.pacienteEndpoint, httpOptions).pipe(
            catchError(this.handleError) // Manejo de errores
        );
    }

    // Metodo para actualizar un paciente
    updatePaciente(id: number, pacienteData: Paciente): Observable<any> {
        const token = this.authService.getToken();
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };

         // Envía una petición PUT al endpoint específico del paciente (ej: /api/pacientes/123)
         return this.http.put<any>(`${this.pacienteEndpoint}/${id}`, pacienteData, httpOptions).pipe(
            catchError(this.handleError) // Reutiliza el manejo de errores
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
        console.error('Error en UserService:', error);
        // Retorna un observable con un mensaje de error amigable para el componente
        return throwError(() => new Error(errorMessage));
    }


}