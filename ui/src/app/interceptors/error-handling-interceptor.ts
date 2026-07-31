import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError, timer } from 'rxjs';
import { LoggingService } from '../services/logging/logging-service';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const logging = inject(LoggingService);

  return next(req).pipe(
    retry({
      // GET is idempotent, so retrying it is safe; POST/PATCH/DELETE are
      // not (e.g. a retried transaction could get recorded twice).
      count: req.method === 'GET' ? MAX_RETRIES : 0,
      delay: (error: HttpErrorResponse, retryCount) => {
        // status 0 means the request never reached a server (dropped
        // connection, offline, CORS-blocked) - worth a retry. A real 4xx/5xx
        // response means the server was reached and answered; retrying that
        // unchanged would just get the same answer again.
        if (error.status !== 0) {
          return throwError(() => error);
        }
        return timer(retryCount * RETRY_DELAY_MS);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      logging.logHttpError(req, error);
      return throwError(() => error);
    }),
  );
};
