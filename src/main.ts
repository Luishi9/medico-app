import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// Importar e inicializar Flowbite JS
import 'flowbite'; // Importa el archivo JS principal
// Si necesitas inicializar componentes específicos después de que la vista esté lista,
// podrías necesitar importaciones adicionales y llamarlas en ngAfterViewInit
// Por ejemplo: import { initDropdowns } from 'flowbite';
// Y luego llamarlo: initDropdowns(); en el hook.