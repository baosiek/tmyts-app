import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoggingService } from '../services/logging/logging-service';
import { errorHandlingInterceptor } from './error-handling-interceptor';

describe('errorHandlingInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let logging: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorHandlingInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    logging = TestBed.inject(LoggingService);
  });

  afterEach(() => httpMock.verify());

  it('retries a GET twice on a network-level failure, then logs and rethrows', fakeAsync(() => {
    spyOn(logging, 'logHttpError');
    let finalError: { status: number } | undefined;
    http.get('http://localhost:8000/assets/foo').subscribe({ error: (e) => (finalError = e) });

    // initial attempt + 2 retries = 3 total requests
    for (let i = 0; i < 3; i++) {
      const req = httpMock.expectOne('http://localhost:8000/assets/foo');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
      tick(2000);
    }

    expect(finalError?.status).toBe(0);
    expect(logging.logHttpError).toHaveBeenCalledTimes(1);
  }));

  it('does not retry a GET on a real server error status', () => {
    spyOn(logging, 'logHttpError');
    let finalError: { status: number } | undefined;
    http.get('http://localhost:8000/assets/foo').subscribe({ error: (e) => (finalError = e) });

    httpMock.expectOne('http://localhost:8000/assets/foo').flush({ detail: 'Not Found' }, { status: 404, statusText: 'Not Found' });

    expect(finalError?.status).toBe(404);
    expect(logging.logHttpError).toHaveBeenCalledTimes(1);
  });

  it('does not retry a POST even on a network-level failure', () => {
    spyOn(logging, 'logHttpError');
    let finalError: { status: number } | undefined;
    http.post('http://localhost:8000/portfolios/', {}).subscribe({ error: (e) => (finalError = e) });

    httpMock.expectOne('http://localhost:8000/portfolios/').error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(finalError?.status).toBe(0);
    expect(logging.logHttpError).toHaveBeenCalledTimes(1);
  });

  it('passes through a successful response without logging', () => {
    spyOn(logging, 'logHttpError');
    let result: unknown;
    http.get('http://localhost:8000/assets/foo').subscribe((r) => (result = r));

    httpMock.expectOne('http://localhost:8000/assets/foo').flush({ ok: true });

    expect(result).toEqual({ ok: true });
    expect(logging.logHttpError).not.toHaveBeenCalled();
  });
});
