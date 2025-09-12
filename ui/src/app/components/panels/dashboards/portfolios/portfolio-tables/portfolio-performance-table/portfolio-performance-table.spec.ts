import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioPerformanceTable } from './portfolio-performance-table';

describe('PortfolioPerformanceTable', () => {
  let component: PortfolioPerformanceTable;
  let fixture: ComponentFixture<PortfolioPerformanceTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioPerformanceTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioPerformanceTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
