import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmytsToolbar } from './tmyts-toolbar';

describe('TmytsToolbar', () => {
  let component: TmytsToolbar;
  let fixture: ComponentFixture<TmytsToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmytsToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmytsToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
