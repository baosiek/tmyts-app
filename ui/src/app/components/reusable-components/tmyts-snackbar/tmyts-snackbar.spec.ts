import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

import { TmytsSnackbar } from './tmyts-snackbar';

describe('TmytsSnackbar', () => {
  let component: TmytsSnackbar;
  let fixture: ComponentFixture<TmytsSnackbar>;
  let snackBarRef: jasmine.SpyObj<MatSnackBarRef<TmytsSnackbar>>;

  beforeEach(async () => {
    snackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismissWithAction']);

    await TestBed.configureTestingModule({
      imports: [TmytsSnackbar],
      providers: [
        { provide: MatSnackBarRef, useValue: snackBarRef },
        { provide: MAT_SNACK_BAR_DATA, useValue: { message: 'Something went wrong', action: 'Close' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TmytsSnackbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the injected message/action data', () => {
    expect(component.data).toEqual({ message: 'Something went wrong', action: 'Close' });
  });

  it('renders the message and action button text', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('span')?.textContent).toContain('Something went wrong');
    expect(el.querySelector('button')?.textContent).toContain('Close');
  });

  it('clicking the action button dismisses the snackbar with the action', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(snackBarRef.dismissWithAction).toHaveBeenCalled();
  });
});
