import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { AuthService } from './auth-service';

function fakeJwt(payload: object): string {
  const base64url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${base64url({ alg: 'none' })}.${base64url(payload)}.signature`;
}

describe('AuthService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('starts unauthenticated when there is no stored token', () => {
    const service = TestBed.inject(AuthService);
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.userId()).toBeNull();
  });

  it('becomes authenticated after a successful login and persists the token', () => {
    const service = TestBed.inject(AuthService);
    service.login('bao', 'secret').subscribe();

    const req = httpMock.expectOne((r) => r.url.endsWith('/auth/login'));
    req.flush({
      access_token: fakeJwt({ sub: 42, exp: Math.floor(Date.now() / 1000) + 3600, iat: 0 }),
      token_type: 'bearer',
      expires_in: 3600,
      user: {
        user_id: 42,
        user_name: 'bao',
        email: 'bao@example.com',
        theme: 'light',
        portfolio_name: 'main',
        user_photo: null,
      },
    });

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.userId()).toBe(42);
    expect(service.profile()?.user_name).toBe('bao');
    expect(localStorage.getItem('tmyts_auth_token')).toBe(service.getToken());
  });

  it('treats an already-expired stored token as unauthenticated', () => {
    localStorage.setItem(
      'tmyts_auth_token',
      fakeJwt({ sub: 1, exp: Math.floor(Date.now() / 1000) - 3600, iat: 0 }),
    );

    const service = TestBed.inject(AuthService);

    expect(service.isAuthenticated()).toBeFalse();
  });

  it('clears token and profile on logout', () => {
    const service = TestBed.inject(AuthService);
    service.login('bao', 'secret').subscribe();
    httpMock
      .expectOne((r) => r.url.endsWith('/auth/login'))
      .flush({
        access_token: fakeJwt({ sub: 1, exp: Math.floor(Date.now() / 1000) + 3600, iat: 0 }),
        token_type: 'bearer',
        expires_in: 3600,
        user: { user_id: 1, user_name: 'bao', email: '', theme: 'light', portfolio_name: '', user_photo: null },
      });

    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.profile()).toBeNull();
    expect(localStorage.getItem('tmyts_auth_token')).toBeNull();
  });
});
