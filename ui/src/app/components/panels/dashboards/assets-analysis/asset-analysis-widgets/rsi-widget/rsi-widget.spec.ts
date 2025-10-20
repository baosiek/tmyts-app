import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsiWidget } from './rsi-widget';

describe('RsiWidget', () => {
  let component: RsiWidget;
  let fixture: ComponentFixture<RsiWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsiWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsiWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
