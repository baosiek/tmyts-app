import { TestBed } from '@angular/core/testing';

import { PortfolioDatabaseService } from './portfolio-database-service';

describe('PortfolioDatabaseService', () => {
  let service: PortfolioDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
