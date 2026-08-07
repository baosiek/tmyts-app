import { Component, computed, inject, input, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, RouterModule } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { AuthService } from '../../../services/auth/auth-service';
import { UserService } from '../../../services/user-service/user-service';
import { TmytsSnackbar } from '../../reusable-components/tmyts-snackbar/tmyts-snackbar';

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

export type MenuItemModel = {
  icon: string
  label: string
  route: string
}

@Component({
  selector: 'app-sidenav',
  imports: [
    ...MATERIAL_IMPORTS,
    RouterLink,
    RouterModule
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {

  menuItems = signal<MenuItemModel[]>(
    [
      {
        icon: "dashboard_customize",
        label: "Portfolios",
        route: "/portfolio_management"
      },
      {
        icon: "finance_chip",
        label: "Bot Performance",
        route: "/live-data"
      },
      {
        icon: "finance_mode",
        label: "Live Price Tracker",
        route: "/live-tracker"
      },
      {
        icon: "analytics",
        label: "Assets Analysis",
        route: "/assets_analysis"
      },
      {
        icon: "widget_medium",
        label: "Control Panel",
        route: "/control-panel"
      },
    ]
  )

  /* boolean value inputed from App wether the collapesed
  button changed its status.*/
  collapsed = input.required()


  /* once collapsed changes this value is compyted  */
  setImageSize = computed(
    () => {
      return this.collapsed() ? '32' : '100';
    }
  );

  authService = inject(AuthService);
  private userService = inject(UserService);
  private _snackBar = inject(MatSnackBar);

  // Falls back to the bundled placeholder when the logged-in user has no
  // photo stored yet.
  photoSrc = computed(() => this.authService.profile()?.user_photo ?? 'assets/bao.jpg');
  displayName = computed(() => this.authService.profile()?.user_name ?? '');

  uploadingPhoto = signal(false);

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = ''; // allow re-selecting the same file later

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      this.showError('Image is too large (max 2MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      this.uploadingPhoto.set(true);

      this.userService.updateUser({ user_photo: dataUri }).subscribe({
        next: () => {
          this.uploadingPhoto.set(false);
          this.authService.setProfilePhoto(dataUri);
        },
        error: (error) => {
          this.uploadingPhoto.set(false);
          this.showError(`Could not update photo: ${JSON.stringify(error.error?.detail ?? error.message)}`);
        },
      });
    };
    reader.readAsDataURL(file);
  }

  private showError(message: string): void {
    this._snackBar.openFromComponent(TmytsSnackbar, {
      data: { message, action: 'Close' },
      panelClass: ['error-snackbar-theme'],
    });
  }
}
