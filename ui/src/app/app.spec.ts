import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { AppConfigService } from './services/app-config/app-config-service';
import { AuthService } from './services/auth/auth-service';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('hides the toolbar/sidenav shell while unauthenticated', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar')).toBeNull();
  });

  it('logout() clears the session and redirects to /login', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const authService = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    spyOn(authService, 'logout');
    spyOn(router, 'navigate').and.resolveTo(true);

    app.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
