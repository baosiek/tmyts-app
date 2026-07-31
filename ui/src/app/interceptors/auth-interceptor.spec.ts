import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AppConfigService } from '../services/app-config/app-config-service';
import { AuthService } from '../services/auth/auth-service';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        // A real getter (not a plain data property) so spyOnProperty(...,
        // 'get') has an accessor to intercept in the regression test below.
        { provide: AppConfigService, useValue: { get apiBaseUrl() { return 'http://localhost:8000'; }, wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('does not attach an Authorization header when there is no token', () => {
    http.get('http://localhost:8000/assets/foo').subscribe();
    const req = httpMock.expectOne('http://localhost:8000/assets/foo');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('attaches the bearer token to requests targeting the API base URL', () => {
    spyOn(auth, 'getToken').and.returnValue('fake-token');

    http.get('http://localhost:8000/assets/foo').subscribe();
    const req = httpMock.expectOne('http://localhost:8000/assets/foo');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush({});
  });

  it('never reads apiBaseUrl for the /config.json request itself, even with a token present', () => {
    // Regression test: AppConfigService.load() fetches /config.json via
    // this same intercepted HttpClient, before apiBaseUrl is known. If the
    // interceptor read apiBaseUrl for that request it would throw on every
    // reload where a token already exists in localStorage.
    spyOn(auth, 'getToken').and.returnValue('fake-token');
    const config = TestBed.inject(AppConfigService);
    spyOnProperty(config, 'apiBaseUrl', 'get').and.throwError(
      'AppConfigService.load() must resolve before config is read',
    );

    expect(() => http.get('/config.json').subscribe()).not.toThrow();
    const req = httpMock.expectOne('/config.json');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({ apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' });
  });

  it('logs out and redirects to /login on a 401 response', () => {
    spyOn(auth, 'getToken').and.returnValue('fake-token');
    spyOn(auth, 'logout');

    http.get('http://localhost:8000/assets/foo').subscribe({ error: () => {} });
    const req = httpMock.expectOne('http://localhost:8000/assets/foo');
    req.flush({ detail: 'Not authenticated' }, { status: 401, statusText: 'Unauthorized' });

    expect(auth.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
