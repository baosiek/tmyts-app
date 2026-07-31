import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AuthUserModel, LoginResponse } from '../../models/auth-user-model';
import { AppConfigService } from '../app-config/app-config-service';

interface JwtPayload {
  sub: number;
  exp: number;
  iat: number;
}

const STORAGE_KEY = 'tmyts_auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);
  private get apiUrl() { return `${this.config.apiBaseUrl}/auth`; }

  private token = signal<string | null>(localStorage.getItem(STORAGE_KEY));
  private profileSignal = signal<AuthUserModel | null>(null);

  readonly profile = this.profileSignal.asReadonly();

  readonly isAuthenticated = computed(() => {
    const token = this.token();
    return token !== null && !this.isExpired(token);
  });

  readonly userId = computed<number | null>(() => {
    const token = this.token();
    return token ? (this.decodePayload(token)?.sub ?? null) : null;
  });

  login(user_name: string, user_password: string) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { user_name, user_password })
      .pipe(tap((response) => this.setSession(response)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.token.set(null);
    this.profileSignal.set(null);
  }

  // Fired from a non-blocking app initializer: the guard already decided
  // synchronously off the token read from localStorage above, so this just
  // refreshes the profile in the background and lets the interceptor's 401
  // handling catch a token that's since been invalidated server-side.
  restoreSession(): void {
    if (this.isAuthenticated()) {
      this.refreshProfile().subscribe({ error: () => {} });
    }
  }

  getToken(): string | null {
    return this.token();
  }

  // Updates the locally-held profile after the caller has already
  // persisted the new photo via UserService.updateUser - avoids a round
  // trip through /auth/me just to reflect a change we already know.
  setProfilePhoto(user_photo: string | null): void {
    const current = this.profileSignal();
    if (current) {
      this.profileSignal.set({ ...current, user_photo });
    }
  }

  private refreshProfile() {
    return this.http
      .get<AuthUserModel>(`${this.apiUrl}/me`)
      .pipe(tap((profile) => this.profileSignal.set(profile)));
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem(STORAGE_KEY, response.access_token);
    this.token.set(response.access_token);
    this.profileSignal.set(response.user);
  }

  private isExpired(token: string): boolean {
    const payload = this.decodePayload(token);
    if (!payload) return true;
    return Date.now() >= payload.exp * 1000;
  }

  private decodePayload(token: string): JwtPayload | null {
    try {
      const [, payload] = token.split('.');
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}
