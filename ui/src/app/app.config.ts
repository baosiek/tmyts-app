import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHighcharts } from 'highcharts-angular';
import { routes } from './app.routes';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideHighcharts(),
    provideNativeDateAdapter(),
     {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false, maxWidth: '90vw', maxHeight: '90vh'}},
     {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000}}
  ]
};
