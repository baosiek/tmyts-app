import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/* Two themes: one for ligh mode and the other for dark*/
export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  private theme: BehaviorSubject<Theme>;
  readonly themeChanges: Observable<Theme>;

  constructor() {
    // Mode stored within the browser
    const value = localStorage.getItem('darkMode')
    const theme: Theme = value === 'true' ? 'dark' : 'light'
    this.theme = new BehaviorSubject<Theme>(theme);
    this.themeChanges = this.theme.asObservable()
  }

  setTheme(isDarkMode: string){
    const theme: Theme = isDarkMode === 'true' ? 'dark' : 'light'
    this.theme.next(theme);
  }

  toggleTheme(mode: string) {
    this.setTheme(mode);
  }

  getCurrentTheme() {
    return this.theme.value;
  }
  
}
