import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmytsSnackbar } from './tmyts-snackbar';

describe('TmytsSnackbar', () => {
  let component: TmytsSnackbar;
  let fixture: ComponentFixture<TmytsSnackbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmytsSnackbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmytsSnackbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
