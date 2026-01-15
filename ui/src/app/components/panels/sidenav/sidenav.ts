import { Component, computed, input, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../../material-imports';

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
        icon: "finance_mode",
        label: "Live Data",
        route: "/live-data"
      },
      {
        icon: "finance_mode",
        label: "Assets analysis",
        route: "/assets_analysis"
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
}
