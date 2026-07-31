import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoggingService } from '../services/logging/logging-service';
import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let logging: LoggingService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    handler = TestBed.inject(GlobalErrorHandler);
    logging = TestBed.inject(LoggingService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  it('logs every error', () => {
    spyOn(logging, 'logError');
    handler.handleError(new Error('boom'));
    expect(logging.logError).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('shows a generic snackbar for a non-HTTP runtime error', () => {
    spyOn(logging, 'logError');
    spyOn(snackBar, 'openFromComponent');

    handler.handleError(new Error('boom'));

    expect(snackBar.openFromComponent).toHaveBeenCalled();
  });

  it('logs but does not show a second snackbar for an HttpErrorResponse', () => {
    spyOn(logging, 'logError');
    spyOn(snackBar, 'openFromComponent');

    handler.handleError(new HttpErrorResponse({ status: 500, statusText: 'Server Error' }));

    expect(logging.logError).toHaveBeenCalled();
    expect(snackBar.openFromComponent).not.toHaveBeenCalled();
  });

  it('does not throw if showing the snackbar itself fails', () => {
    spyOn(logging, 'logError');
    spyOn(snackBar, 'openFromComponent').and.throwError('snackbar failed');

    expect(() => handler.handleError(new Error('boom'))).not.toThrow();
  });
});
