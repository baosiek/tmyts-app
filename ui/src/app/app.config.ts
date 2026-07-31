import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { provideHighcharts } from 'highcharts-angular';
import { routes } from './app.routes';
import { AppConfigService } from './services/app-config/app-config-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // Loads /config.json (runtime API URLs) before the app renders, so a
    // single built image can be promoted across environments in Kubernetes.
    provideAppInitializer(() => inject(AppConfigService).load()),
    provideHighcharts(

      {
        modules: () => {
          return [
            import('highcharts/indicators/indicators'),
            import('highcharts/indicators/rsi')
          ]
        }
      }

    ),
    provideNativeDateAdapter(),
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false, maxWidth: '90vw', maxHeight: '90vh' } },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } }
  ]
};
