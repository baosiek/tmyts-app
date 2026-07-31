import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppConfigService } from '../../../services/app-config/app-config-service';
import { Sidenav } from './sidenav';

describe('Sidenav', () => {
  let component: Sidenav;
  let fixture: ComponentFixture<Sidenav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidenav],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidenav);
    fixture.componentRef.setInput('collapsed', false);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('falls back to the bundled placeholder photo when no profile is loaded', () => {
    expect(component.photoSrc()).toBe('assets/bao.jpg');
  });
});
