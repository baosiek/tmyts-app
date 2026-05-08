import { TestBed } from '@angular/core/testing';

import { IndicatorTaService } from './indicator-ta-service';

describe('IndicatorTaService', () => {
  let service: IndicatorTaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatorTaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
