import { TestBed } from '@angular/core/testing';

import { PortfolioPerformanceService } from './portfolio-performance-service';

describe('PortfolioPerformanceService', () => {
  let service: PortfolioPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
