import { TestBed } from '@angular/core/testing';

import { TmytsPricesHistory } from './tmyts-prices-history';

describe('TmytsPricesHistory', () => {
  let service: TmytsPricesHistory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmytsPricesHistory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
