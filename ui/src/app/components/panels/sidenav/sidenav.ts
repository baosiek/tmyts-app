import { Component, computed, inject, input, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { RouterLink, RouterModule } from '@angular/router';

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
