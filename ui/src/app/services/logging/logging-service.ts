import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Single funnel every error in the app goes through - the interceptor logs
// every failed HTTP call here, GlobalErrorHandler logs everything else here.
// Currently just structured console output; wiring a real provider (Sentry,
// etc.) later means adding its captureException/captureMessage call in the
// two methods below, not re-plumbing every call site.
@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  logError(error: unknown, context?: Record<string, unknown>): void {
    console.error('[LoggingService]', {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
    });
  }

  logHttpError(req: HttpRequest<unknown>, error: HttpErrorResponse): void {
    console.error('[LoggingService]', {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.urlWithParams,
      status: error.status,
      statusText: error.statusText,
      message: error.message,
    });
  }
}
