import { TestBed } from '@angular/core/testing';

import { AssetsPriceHistoryService } from './assets-price-history-service';

describe('AssetsPriceHistoryService', () => {
  let service: AssetsPriceHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsPriceHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
