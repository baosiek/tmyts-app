import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material-imports';
import { AuthService } from '../../services/auth/auth-service';
import { TmytsSnackbar } from '../reusable-components/tmyts-snackbar/tmyts-snackbar';

@Component({
  selector: 'app-login',
  imports: [
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private _formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  submitting = signal(false);

  loginForm = this._formBuilder.group({
    user_name: ['', Validators.required],
    user_password: ['', Validators.required],
  });

  submit(): void {
    if (this.loginForm.invalid) return;

    const { user_name, user_password } = this.loginForm.getRawValue();
    this.submitting.set(true);

    this.authService.login(user_name!, user_password!).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.submitting.set(false);
        const message = `Login failed: ${JSON.stringify(error.error?.detail ?? error.message)}`;
        this._snackBar.openFromComponent(TmytsSnackbar, {
          data: { message, action: 'Close' },
          panelClass: ['error-snackbar-theme'],
        });
      },
    });
  }
}
