import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSetting } from './color-setting';

describe('ColorSetting', () => {
  let component: ColorSetting;
  let fixture: ComponentFixture<ColorSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSetting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorSetting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
