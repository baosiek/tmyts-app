import { TestBed } from '@angular/core/testing';

import { TmytsHoldings } from './tmyts-holdings';

describe('TmytsHoldings', () => {
  let service: TmytsHoldings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmytsHoldings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
