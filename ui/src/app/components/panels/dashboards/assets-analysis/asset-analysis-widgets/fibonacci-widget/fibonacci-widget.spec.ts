import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FibonacciWidget } from './fibonacci-widget';

describe('FibonacciWidget', () => {
  let component: FibonacciWidget;
  let fixture: ComponentFixture<FibonacciWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FibonacciWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FibonacciWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
