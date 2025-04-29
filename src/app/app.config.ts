import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
// Importar servicios de Autenticación
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), provideFirebaseApp(() => initializeApp({ projectId: "datos-79aaa", appId: "1:247502579343:web:080b68d381f7acacdf32fa", databaseURL: "https://datos-79aaa-default-rtdb.firebaseio.com", storageBucket: "datos-79aaa.firebasestorage.app", apiKey: "AIzaSyDW2zshAMKP0lM4ksiDDDdU6__k-lXEyxc", authDomain: "datos-79aaa.firebaseapp.com", messagingSenderId: "247502579343", measurementId: "G-1VKQZHVJ9F" })), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "datos-79aaa", appId: "1:247502579343:web:080b68d381f7acacdf32fa", databaseURL: "https://datos-79aaa-default-rtdb.firebaseio.com", storageBucket: "datos-79aaa.firebasestorage.app", apiKey: "AIzaSyDW2zshAMKP0lM4ksiDDDdU6__k-lXEyxc", authDomain: "datos-79aaa.firebaseapp.com", messagingSenderId: "247502579343", measurementId: "G-1VKQZHVJ9F" })), provideDatabase(() => getDatabase()), provideFirebaseApp(() => initializeApp({ projectId: "datos-79aaa", appId: "1:247502579343:web:080b68d381f7acacdf32fa", databaseURL: "https://datos-79aaa-default-rtdb.firebaseio.com", storageBucket: "datos-79aaa.firebasestorage.app", apiKey: "AIzaSyDW2zshAMKP0lM4ksiDDDdU6__k-lXEyxc", authDomain: "datos-79aaa.firebaseapp.com", messagingSenderId: "247502579343", measurementId: "G-1VKQZHVJ9F" })), provideAuth(() => getAuth())
  ]
};
