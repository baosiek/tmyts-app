import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TmytsSnackbar } from '../components/reusable-components/tmyts-snackbar/tmyts-snackbar';
import { LoggingService } from '../services/logging/logging-service';

// Safety net for anything not already caught by a component's own `error`
// callback or error-handling-interceptor.ts (e.g. a template error, or a
// .subscribe() with no error handler) - replaces Angular's default
// console-only ErrorHandler.
@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private logging = inject(LoggingService);
  private snackBar = inject(MatSnackBar);
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    this.logging.logError(error);

    // An HttpErrorResponse reaching here means a component chose not to
    // handle it, and the interceptor already logged it centrally - a
    // second generic toast on top of whatever (if anything) the component
    // shows would just be noise. Only show one for genuinely unexpected
    // runtime errors.
    if (error instanceof HttpErrorResponse) {
      return;
    }

    try {
      this.zone.run(() => {
        this.snackBar.openFromComponent(TmytsSnackbar, {
          data: { message: 'Something went wrong. Please try again.', action: 'Close' },
          panelClass: ['error-snackbar-theme'],
        });
      });
    } catch {
      // Never let the error handler itself throw - that could recurse.
    }
  }
}
