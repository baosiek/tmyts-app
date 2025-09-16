import { TestBed } from '@angular/core/testing';

import { PortfolioActivityService } from './portfolio-activity-service';

describe('PortfolioActivityService', () => {
  let service: PortfolioActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
