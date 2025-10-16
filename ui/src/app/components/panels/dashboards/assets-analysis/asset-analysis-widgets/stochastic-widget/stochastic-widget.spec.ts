import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StochasticWidget } from './stochastic-widget';

describe('StochasticWidget', () => {
  let component: StochasticWidget;
  let fixture: ComponentFixture<StochasticWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StochasticWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StochasticWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
