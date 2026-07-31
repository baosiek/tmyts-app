import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppConfigService } from '../../../services/app-config/app-config-service';
import { UserService } from '../../../services/user-service/user-service';
import { Sidenav } from './sidenav';

function selectEventFor(file: File | null): Event {
  const input = document.createElement('input');
  input.type = 'file';
  if (file) {
    Object.defineProperty(input, 'files', { value: [file] });
  }
  return { target: input } as unknown as Event;
}

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

  it('rejects a non-image file without calling the API', () => {
    const userService = TestBed.inject(UserService);
    spyOn(userService, 'updateUser');

    const textFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    component.onPhotoSelected(selectEventFor(textFile));

    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it('rejects an image over the 2MB limit without calling the API', () => {
    const userService = TestBed.inject(UserService);
    spyOn(userService, 'updateUser');

    const oversized = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' });
    component.onPhotoSelected(selectEventFor(oversized));

    expect(userService.updateUser).not.toHaveBeenCalled();
  });
});
