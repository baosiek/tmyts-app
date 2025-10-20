import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObvWidget } from './obv-widget';

describe('ObvWidget', () => {
  let component: ObvWidget;
  let fixture: ComponentFixture<ObvWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObvWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObvWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
