import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core'; // *** Importa ChangeDetectorRef ***
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initDatepickers } from 'flowbite';

// Importa la clase Datepicker del paquete flowbite-datepicker
import { Datepicker } from 'flowbite-datepicker';

@Component({
  selector: 'app-registrar-paciente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registrar-paciente.component.html',
  styleUrl: './registrar-paciente.component.css'
})
export class RegistrarPacienteComponent implements AfterViewInit, OnDestroy {

  // *** Obtiene la referencia al input del datepicker usando ViewChild ***
  @ViewChild('datepickerInput') datepickerInputEl?: ElementRef<HTMLInputElement>;

  // Opcional: Guarda la instancia del Datepicker si necesitas interactuar con ella (ej: clear, set date)
  private datepickerInstance: Datepicker | null = null;

  curp: string = '';
  nombre: string = '';
  fechaNacimiento: string = '';
  sexo: string = '';
  domicilio: string = '';
  telefono: string = '';

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef) { }

  ngAfterViewInit() {
    //initDatepickers();

    console.log('RegistrarPacienteComponent ngAfterViewInit - Inicializando datepicker y configurando listener...');
    // initDatepickers(); // Puedes llamar a esta si tienes MÚLTIPLES datepickers inicializados vía data attributes

    // *** Obtiene el elemento nativo del input y inicializa el Datepicker programáticamente ***
    if (this.datepickerInputEl) {
      const datepickerEl = this.datepickerInputEl.nativeElement;

      // *** Crea la instancia del Datepicker ***
      // El constructor es generalmente new Datepicker(elementoDelInput, opciones)
      try {
        this.datepickerInstance = new Datepicker(datepickerEl, {
          // Pasa opciones aquí si necesitas, deben coincidir con tus data attributes
          format: 'yyyy-mm-dd', // <-- Asegúrate de que el formato aquí coincida con el HTML
          // otras opciones como orientation, language, etc.
        });

        console.log('Instancia de Datepicker creada e inicializada programáticamente.');

        console.log('Listener para evento datepicker.select añadido.');

      } catch (e: any) {
        console.error('Error al inicializar Datepicker o añadir listener:', e);
        console.error('Mensaje de error:', e.message);
      }
    } else {
      console.warn('Elemento del input Datepicker no encontrado para inicialización programática.');
    }

  }

  async onRegister() {
    this.errorMessage = null; // Resetear el mensaje de error
    this.successMessage = null;

    // *** OBTÉN el valor de la fecha directamente de la instancia del Datepicker ***
    // Esto bypassa los problemas de sincronización de ngModel con la UI del Datepicker
    console.log("Obteniendo fecha directamente de la instancia del Datepicker...");
    let selectedDateValue = ''; // Variable temporal para guardar el valor obtenido
    if (this.datepickerInstance) {
      // getDate() debería retornar un objeto Date o null/undefined si no hay fecha seleccionada
      const dateObject: any = this.datepickerInstance.getDate();
      console.log("Valor obtenido de datepickerInstance.getDate():", dateObject);

      // Verifica si getDate() devolvió un objeto Date válido
      if (dateObject instanceof Date && !isNaN(dateObject.getTime())) {
        // Formatea el objeto Date al formato de cadena YYYY-MM-DD que esperas en el backend
        const year = dateObject.getFullYear();
        // getMonth() es base 0 (enero es 0), así que suma 1 y padStart para 2 dígitos
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObject.getDate().toString().padStart(2, '0');

        selectedDateValue = `${year}-${month}-${day}`; // Construye la cadena YYYY-MM-DD
        console.log("Fecha formateada para envío:", selectedDateValue);

      } else {
        console.warn("datepickerInstance.getDate() no devolvió una fecha válida (es null/undefined o no es Date).");
        // Si getDate() no devuelve una fecha válida, es porque no se ha seleccionado ninguna
        selectedDateValue = ''; // Asegúrate de que la variable esté vacía
      }
    } else {
      console.warn("Instancia de Datepicker no disponible al hacer clic en Registrar.");
      // Si por alguna razón la instancia no se creó, toma el valor directamente del input como fallback
      if (this.datepickerInputEl) {
        selectedDateValue = this.datepickerInputEl.nativeElement.value;
        console.log("Usando valor directo del input como fallback (instancia nula):", selectedDateValue);
      } else {
        selectedDateValue = ''; // Si ni siquiera el input se encontró, el valor es vacío
      }
    }

    // *** Asigna el valor obtenido (directamente del Datepicker o del input) a la propiedad del modelo ***
    this.fechaNacimiento = selectedDateValue;
    console.log("this.fechaNacimiento establecido para validación/envío:", this.fechaNacimiento);



    // **** validacion frontend ****
    // **** Validación frontend detallada ****
    const missingFieldsNames: string[] = []; // Array para almacenar los nombres de los campos faltantes

    if (!this.nombre) { missingFieldsNames.push('Nombre'); }
    if (!this.curp) { missingFieldsNames.push('CURP'); }
    // Ahora que usamos this.cd.detectChanges(), esta validación debería pasar si se seleccionó fecha
    if (!this.fechaNacimiento) { missingFieldsNames.push('Fecha de Nacimiento'); }
    if (!this.sexo) { missingFieldsNames.push('Sexo'); }
    if (!this.domicilio) { missingFieldsNames.push('Domicilio'); }
    if (!this.telefono) { missingFieldsNames.push('Teléfono'); }


    // *** Verifica si hay campos faltantes ***
    if (missingFieldsNames.length > 0) {
      // Si hay campos faltantes, construye un mensaje de error detallado
      this.errorMessage = 'Por favor, completa los siguientes campos: ' + missingFieldsNames.join(', '); // Une los nombres con comas
      console.warn("Validación frontend fallida. Campos faltantes:", missingFieldsNames); // Log para depuración
      return; // Detiene la ejecución del método si hay campos faltantes
    }


    // --- Usa setTimeout(0) para asegurarte de que [(ngModel)] ha actualizado la propiedad ---
    setTimeout(() => { // <--- Envuelve la lógica de envío en un setTimeout
      console.log("Valor de this.fechaNacimiento DENTRO del setTimeout:", this.fechaNacimiento);

      // Prepara los datos para enviar DESPUÉS de que Angular haya actualizado this.fechaNacimiento
      const registerPaciente = {
        curp: this.curp,
        nombre: this.nombre,
        fechaNacimiento: this.fechaNacimiento, // <--- ¡Ahora esta propiedad debería tener el valor del input!
        sexo: this.sexo,
        domicilio: this.domicilio,
        telefono: this.telefono
      };

      console.log("Datos enviados al backend (dentro de setTimeout):", registerPaciente); // <--- Log aquí para verificar


      // Llama a la funcion de registro del servicio
      // Usa el objeto registerPaciente que contiene el valor actualizado de fechaNacimiento
      this.authService.registerPacientes(registerPaciente).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);

          // Opcional: Limpiar el formulario después del registro exitoso
          this.resetForm();

          this.successMessage = 'Paciente registrado exitosamente.';

          // *** Oculta el mensaje de éxito después de unos segundos ***
          setTimeout(() => { // <-- Añade un setTimeout aquí
            this.successMessage = null; // <-- Asigna null para ocultar el mensaje
          }, 5000); // <-- Tiempo en milisegundos (ej. 4000 = 4 segundos)


        },
        error: (error) => {
          console.error('Error en el componente de registro: ', error); // Log el error completo
          // error.message debería contener el mensaje del backend si lo envías
          this.errorMessage = error.message || 'Error al registrar paciente. Inténtalo de nuevo.';

          setTimeout(() => { // <-- Añade un setTimeout aquí
            this.errorMessage = null; // <-- Asigna null para ocultar el mensaje
          }, 10000); // <-- Tiempo en milisegundos (ej. 4000 = 4 segundos)
        }
      });

    }, 0); // <--- Retraso de 0ms

  }

  // Método opcional para limpiar el formulario
  resetForm(): void {
    this.curp = '';
    this.nombre = '';
    this.fechaNacimiento = '';
    this.sexo = '';
    this.domicilio = '';
    this.telefono = '';
    this.errorMessage = null;
    this.successMessage = null;
    // Si usas un datepicker programático, quizás necesites resetear su valor también.
    // Con initDatepickers(), a veces limpiar el input asociado es suficiente.

    // *** Limpiar el valor visual del input del datepicker ***
    if (this.datepickerInputEl) {
      this.datepickerInputEl.nativeElement.value = '';
    }


  }

  // *** Implementa OnDestroy para limpiar el listener y la instancia del Datepicker ***
  ngOnDestroy(): void {
    console.log('RegistrarPacienteComponent ngOnDestroy - Destruyendo instancia de Datepicker.');
    // Asegúrate de que solo destruyes la instancia si existe y tiene el método destroy
    if (this.datepickerInstance && typeof this.datepickerInstance.destroy === 'function') {
      this.datepickerInstance.destroy();
      this.datepickerInstance = null;
      console.log('Instancia de Datepicker destruida.');
    } else if (this.datepickerInstance) {
      console.warn('La instancia de Datepicker no tiene un método .destroy() o ya fue destruida.');
    }
    // Ya no hay event listener que quitar manualmente si eliminamos el código addEventListener
  }

}
