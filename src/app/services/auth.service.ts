import { Injectable } from '@angular/core';
// Importar el servicio y las funciones de Firebase Auth
import { Auth, signInWithEmailAndPassword, signOut, user, User, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Database, ref, set, objectVal } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Inyectar el servicio de Firebase Auth
  constructor(private auth: Auth, private db: Database) { }

  // Iniciar sesión con correo electrónico y contraseña usando Autenticación de Firebase
  // Firebase Auth requiere EMAIL y CONTRASEÑA.
  // Tu estructura actual tiene NOMBRE DE USUARIO y CONTRASEÑA HASHEDA.
  // NO PUEDES usar directamente tu tabla 'usuarios' con este método.
  // Necesitas que tus usuarios existan en el sistema de Autenticación de Firebase.
  login(email: string, password: string): Promise<any> {
    // Este método envía el email y la contraseña (sin hashear) a los servidores de Firebase Auth
    // Firebase Auth se encarga de comparar la contraseña y gestionar la sesión.
    // Devuelve una Promesa que se resuelve con los datos del usuario si el login es exitoso.
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // --- Método de Registro de Usuarios ---
  async register(email: string, password: string, usernameAnterior?: string): Promise<User | null> {
    try {
      // 1. Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Usuario creado en Firebase Auth:', userCredential.user);
      const firebaseUser = userCredential.user; // Este es el usuario creado por Firebase Auth

      // 2. Opcional: Guardar datos adicionales en Realtime Database usando el UID del nuevo usuario
      if (firebaseUser) {
          const userUid = firebaseUser.uid;
          const userData = {
              email: firebaseUser.email, // Puedes guardar el email
              // Puedes añadir otros campos iniciales
              nombre: 'Nuevo Usuario', // Un nombre por defecto
              usernameAnterior: usernameAnterior || null, // Guarda el username antiguo si lo tienes
              fechaRegistro: new Date().toISOString() // Guarda la fecha de registro
              // ... cualquier otro dato que quieras guardar al inicio
          };

          // Crea una referencia al nodo del usuario en tu estructura de Realtime Database
          const userDbRef = ref(this.db, `usuarios/${userUid}`);

          // Escribe los datos en la base de datos
          await set(userDbRef, userData);

          console.log('Usuario registrado en Auth y datos guardados en RTDB:', firebaseUser.uid);
      }

      // Devuelve el objeto User creado por Firebase Auth
      return firebaseUser;

    } catch (error: any) {
      console.error('Error durante el registro:', error.message);
      // Puedes lanzar el error para que el componente que llama lo maneje
      throw error;
    }
  }
  // ---------------------------------------

  // Cerrar sesión usando Autenticación de Firebase
  // Esto limpia la sesión gestionada por Firebase.
  logout(): Promise<void> {
    console.log('Cerrando sesión (Firebase Auth)...');
    return signOut(this.auth);
  }

  // Obtener el usuario autenticado actualmente
  // Retorna un Observable que emite el usuario (tipo User) o null si no está logueado
  // Este es el método recomendado para obtener el estado de autenticación.
  getCurrentUser(): Observable<User | null> {
     // @angular/fire proporciona un observable conveniente 'user' que sigue el estado de auth
     return user(this.auth);
  }

  // Verificar si hay un usuario actualmente logueado
  // Puedes verificar esto suscribiéndote a getCurrentUser() o usando el estado síncrono si es necesario.
  // Una forma de obtener el estado actual una vez:
  async isLoggedIn(): Promise<boolean> {
     // Firebase Auth mantiene el estado internamente y onAuthStateChanged te notifica los cambios.
     return new Promise((resolve) => {
       // onAuthStateChanged es un listener que se llama inmediatamente con el estado actual
       // y luego cada vez que el estado cambia (login/logout).
       // Nos desuscribimos inmediatamente después de la primera llamada para obtener el estado actual.
       const unsubscribe = this.auth.onAuthStateChanged(user => {
         unsubscribe(); // Deja de escuchar después de obtener el primer estado
         resolve(!!user); // user convierte el objeto User o null a un booleano
       });
     });
     // O usando el observable (más angular-idiomático):
     // return this.getCurrentUser().pipe(first(), map(user => !!user));
  }

   // Puedes obtener el usuario actual de forma síncrona (puede ser null al inicio)
   getCurrentUserSnapshot(): User | null {
       return this.auth.currentUser;
   }

   // Si necesitas interactuar con un backend propio, puedes obtener el token de ID
   async getIdToken(): Promise<string | null> {
       const currentUser = await this.auth.currentUser;
       return currentUser ? currentUser.getIdToken() : null;
   }

}
