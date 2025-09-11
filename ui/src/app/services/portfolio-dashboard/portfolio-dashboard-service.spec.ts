import { TestBed } from '@angular/core/testing';

import { PortfolioDashboardService } from './portfolio-dashboard-service';

describe('PortfolioTypeService', () => {
  let service: PortfolioDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
