import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekPerformance } from './week-performance';

describe('WeekPerformance', () => {
  let component: WeekPerformance;
  let fixture: ComponentFixture<WeekPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekPerformance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekPerformance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
