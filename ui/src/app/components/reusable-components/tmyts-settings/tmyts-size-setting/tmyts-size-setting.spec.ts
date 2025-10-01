import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmytsSizeSetting } from './tmyts-size-setting';

describe('TmytsSizeSetting', () => {
  let component: TmytsSizeSetting;
  let fixture: ComponentFixture<TmytsSizeSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TmytsSizeSetting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TmytsSizeSetting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
