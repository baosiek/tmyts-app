import { TestBed } from '@angular/core/testing';

import { OhlcvData } from './ohlcv-data';

describe('OhlcvData', () => {
  let service: OhlcvData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OhlcvData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
