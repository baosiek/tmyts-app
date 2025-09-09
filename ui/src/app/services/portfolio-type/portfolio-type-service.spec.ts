import { TestBed } from '@angular/core/testing';

import { PortfolioTypeService } from './portfolio-type-service';

describe('PortfolioTypeService', () => {
  let service: PortfolioTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
