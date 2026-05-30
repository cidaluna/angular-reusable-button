import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// 1. Importe o gerenciador de biblioteca do Font Awesome
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
// 2. Importe os ícones específicos que você quer usar no seu projeto
import { faSave, faCamera, faUpload} from '@fortawesome/free-solid-svg-icons';

// 3. Função responsável por alimentar a biblioteca global
export function initializeIcons(library: FaIconLibrary) {
  return () => {
    library.addIcons(faSave, faCamera, faUpload);
  };
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // 4. Injeta a configuração global na inicialização do sistema
    {
      provide: APP_INITIALIZER,
      useFactory: initializeIcons,
      deps: [FaIconLibrary],
      multi: true
    }
  ]
};
