import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MATERIAL_IMPORTS } from './material-imports';
import { DarkModeService } from './services/dark_mode/dark-mode-service';
import { Sidenav } from './components/panels/sidenav/sidenav';
import { ThemeService } from './services/theme-service/theme-service';

@Component({
  selector: 'app-root',
  imports: [
    ...MATERIAL_IMPORTS,
    RouterOutlet,
    Sidenav
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('TMYTS');

  // holds the state of sidenav, ie, collapsed or not
  collapsed = signal(false);

  // holds status of dark mode, ie, true or false
  darkMode = signal(false);

  /* Executed every time collapse status changes */
  sideNavWidth = computed(
    () => this.collapsed() ? '65px' : '240px'
  );

  themeService = inject(ThemeService)

  toggleDarkMode() {    
    this.darkMode.set(!this.darkMode())
    console.log("Theme is: ", this.darkMode())
    this.themeService.setTheme(this.darkMode())
  }
}
