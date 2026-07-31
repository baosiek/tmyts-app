import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme-service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    document.body.classList.remove('dark-theme');
    document.body.style.removeProperty('--mat-sys-surface');
    document.body.style.removeProperty('--mat-sys-on-surface');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('defaults to light (isDark false, no dark-theme class)', () => {
    expect(service.isDark()).toBeFalse();
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
  });

  it('setTheme(true) sets isDark and adds the dark-theme class to <body>', () => {
    service.setTheme(true);

    expect(service.isDark()).toBeTrue();
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
  });

  it('setTheme(false) after setTheme(true) removes the dark-theme class again', () => {
    service.setTheme(true);
    service.setTheme(false);

    expect(service.isDark()).toBeFalse();
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
  });

  it('getChartColors reads the current theme colors off document.body', () => {
    document.body.style.setProperty('--mat-sys-surface', 'rgb(1, 2, 3)');
    document.body.style.setProperty('--mat-sys-on-surface', 'rgb(4, 5, 6)');

    const colors = service.getChartColors();

    expect(colors.background).toBe('rgb(1, 2, 3)');
    expect(colors.text).toBe('rgb(4, 5, 6)');
  });
});
