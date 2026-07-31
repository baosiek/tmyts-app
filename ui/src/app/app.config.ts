import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { provideHighcharts } from 'highcharts-angular';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './error-handlers/global-error-handler';
import { authInterceptor } from './interceptors/auth-interceptor';
import { errorHandlingInterceptor } from './interceptors/error-handling-interceptor';
import { AppConfigService } from './services/app-config/app-config-service';
import { AuthService } from './services/auth/auth-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // auth attaches the token (outer); error-handling wraps the actual
    // send/retry/log closest to the backend (inner) - see
    // error-handling-interceptor.ts for the retry policy.
    provideHttpClient(withInterceptors([authInterceptor, errorHandlingInterceptor])),
    // Safety net for anything not already caught by a component's own
    // `error` callback or the interceptor above - see global-error-handler.ts.
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // Loads /config.json (runtime API URLs) before the app renders, so a
    // single built image can be promoted across environments in Kubernetes.
    // Angular runs multiple provideAppInitializer callbacks concurrently,
    // not in registration order, so restoreSession() (which needs
    // apiBaseUrl for its own HTTP call) is chained after this one inside a
    // single initializer rather than registered separately.
    provideAppInitializer(() => {
      // Both injected synchronously, before the first `await`/`.then`:
      // inject() only works within the synchronous portion of the
      // initializer's injection context.
      const appConfigService = inject(AppConfigService);
      const authService = inject(AuthService);
      return appConfigService.load().then(() => {
        // Not awaited from here: the auth guard decides synchronously off
        // the token AuthService already read from localStorage at
        // construction. This just refreshes the profile (name/photo) in
        // the background and lets the interceptor's 401 handling catch a
        // token invalidated server-side.
        authService.restoreSession();
      });
    }),
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
