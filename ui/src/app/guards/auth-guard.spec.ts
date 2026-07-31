import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AppConfigService } from '../services/app-config/app-config-service';
import { authGuard } from './auth-guard';

function fakeJwt(payload: object): string {
  const base64url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${base64url({ alg: 'none' })}.${base64url(payload)}.signature`;
}

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
  });

  afterEach(() => localStorage.clear());

  it('blocks navigation and redirects to /login when not authenticated', () => {
    const router = TestBed.inject(Router);
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).toEqual(router.createUrlTree(['/login']));
  });

  it('allows navigation when a valid token is already stored', () => {
    localStorage.setItem(
      'tmyts_auth_token',
      fakeJwt({ sub: 1, exp: Math.floor(Date.now() / 1000) + 3600, iat: 0 }),
    );
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).toBeTrue();
  });
});
