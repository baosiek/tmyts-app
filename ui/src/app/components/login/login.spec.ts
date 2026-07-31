import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginResponse } from '../../models/auth-user-model';
import { AppConfigService } from '../../services/app-config/app-config-service';
import { AuthService } from '../../services/auth/auth-service';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with an invalid, empty form', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('does nothing on submit while the form is invalid', () => {
    spyOn(authService, 'login');
    component.submit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('logs in and navigates home on a valid submit', () => {
    spyOn(authService, 'login').and.returnValue(of({} as unknown as LoginResponse));
    component.loginForm.setValue({ user_name: 'bao', user_password: 'secret' });

    component.submit();

    expect(authService.login).toHaveBeenCalledWith('bao', 'secret');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.submitting()).toBeFalse();
  });

  it('stops submitting and does not navigate when login fails', () => {
    spyOn(authService, 'login').and.returnValue(
      throwError(() => ({ error: { detail: 'Invalid credentials' } })),
    );
    component.loginForm.setValue({ user_name: 'bao', user_password: 'wrong' });

    component.submit();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.submitting()).toBeFalse();
  });
});
