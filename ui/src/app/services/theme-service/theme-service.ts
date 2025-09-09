import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // public setTheme(theme: 'light' | 'dark') {
  //   this.applyTheme(theme);
  // }

  public setTheme(theme: boolean) {
    this.applyTheme(theme);
  }

  // private applyTheme(theme: 'light' | 'dark') {

  //   const body = document.body;
  //   if (theme === 'dark') {
  //     document.body.classList.toggle('dark-theme', true);
  //   } else {
  //     document.body.classList.toggle('dark-theme', false);
  //   }
  // }

    private applyTheme(theme: boolean) {

    const body = document.body;
    if (theme) {
      document.body.classList.toggle('dark-theme', true);
    } else {
      document.body.classList.toggle('dark-theme', false);
    }
  }
  
}
