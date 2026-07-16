import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Reactive so any component (e.g. a Highcharts chart, which doesn't pick up
  // CSS variable changes on its own) can re-derive its own colors whenever
  // the theme toggles, instead of just relying on the CSS side effect below.
  readonly isDark = signal(false);

  public setTheme(theme: boolean) {
    this.isDark.set(theme);
    this.applyTheme(theme);
  }
  private applyTheme(theme: boolean) {
    document.body.classList.toggle('dark-theme', theme);
  }

  /**
   * Current theme's background/text colors, for components (e.g. Highcharts
   * charts) that render outside Angular's DOM and so can't just pick up CSS
   * variable changes on their own - they need to read and re-apply these
   * colors themselves whenever isDark() toggles.
   *
   * Reads from document.body, not document.documentElement/<html>: the
   * `dark-theme` class above is applied to <body>, and CSS custom properties
   * only cascade down to its descendants - <html> would always report the
   * light theme's values regardless of the toggle.
   */
  public getChartColors(): { background: string; text: string } {
    const styles = getComputedStyle(document.body);
    return {
      background: styles.getPropertyValue('--mat-sys-surface').trim(),
      text: styles.getPropertyValue('--mat-sys-on-surface').trim(),
    };
  }
}
