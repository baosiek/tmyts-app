import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivePortfolioPerformance } from './live-portfolio-performance';

describe('LivePortfolioPerformance', () => {
  let component: LivePortfolioPerformance;
  let fixture: ComponentFixture<LivePortfolioPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivePortfolioPerformance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivePortfolioPerformance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
