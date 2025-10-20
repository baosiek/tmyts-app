import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacdWidget } from './macd-widget';

describe('MacdWidget', () => {
  let component: MacdWidget;
  let fixture: ComponentFixture<MacdWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MacdWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacdWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
