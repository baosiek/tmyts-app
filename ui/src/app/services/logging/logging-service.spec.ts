import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { LoggingService } from './logging-service';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('logs runtime errors with a message and stack', () => {
    spyOn(console, 'error');
    service.logError(new Error('boom'), { where: 'test' });

    expect(console.error).toHaveBeenCalledWith(
      '[LoggingService]',
      jasmine.objectContaining({
        message: 'boom',
        context: { where: 'test' },
      }),
    );
  });

  it('logs non-Error values by stringifying them', () => {
    spyOn(console, 'error');
    service.logError('just a string');

    expect(console.error).toHaveBeenCalledWith(
      '[LoggingService]',
      jasmine.objectContaining({ message: 'just a string' }),
    );
  });

  it('logs HTTP errors with method, url, and status', () => {
    spyOn(console, 'error');
    const req = new HttpRequest('GET', 'http://localhost:8000/assets/foo');
    const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: 'http://localhost:8000/assets/foo' });

    service.logHttpError(req, error);

    expect(console.error).toHaveBeenCalledWith(
      '[LoggingService]',
      jasmine.objectContaining({
        method: 'GET',
        status: 404,
        statusText: 'Not Found',
      }),
    );
  });
});
