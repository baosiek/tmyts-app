import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AppConfigService } from '../services/app-config/app-config-service';
import { AuthService } from '../services/auth/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const config = inject(AppConfigService);

  // Excluded explicitly, not just by URL shape: this is the request that
  // *loads* apiBaseUrl in the first place (AppConfigService.load()), so
  // config.apiBaseUrl isn't safe to read yet when it's in flight - reading
  // it here would throw and break bootstrap on every reload where a token
  // already exists in localStorage.
  const isConfigRequest = req.url === '/config.json';

  const token = auth.getToken();
  const authedReq =
    token && !isConfigRequest && req.url.startsWith(config.apiBaseUrl)
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
