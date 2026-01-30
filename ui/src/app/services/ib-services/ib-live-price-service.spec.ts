import { TestBed } from '@angular/core/testing';

import { IbLivePriceService } from './ib-live-price-service';

describe('IbLivePriceService', () => {
  let service: IbLivePriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IbLivePriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
