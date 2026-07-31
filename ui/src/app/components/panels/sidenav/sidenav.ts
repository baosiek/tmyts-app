import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { AuthService } from '../../../services/auth/auth-service';

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
        label: "Live Prices",
        route: "/live-data"
      },
      {
        icon: "finance_mode",
        label: "Live Tracker",
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
  private router = inject(Router);

  // Falls back to the bundled placeholder when the logged-in user has no
  // photo stored yet.
  photoSrc = computed(() => this.authService.profile()?.user_photo ?? 'assets/bao.jpg');
  displayName = computed(() => this.authService.profile()?.user_name ?? '');

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
