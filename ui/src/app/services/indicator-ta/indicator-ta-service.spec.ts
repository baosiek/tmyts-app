import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { IndicatorTaService } from './indicator-ta-service';

describe('IndicatorTaService', () => {
  let service: IndicatorTaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(IndicatorTaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllIndicator GETs a 14-lookback window for the given asset', () => {
    let result: unknown;
    service.getAllIndicator('AAPL').subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/indicators_ta/all/asset/AAPL/lookback/14/');
    expect(req.request.method).toBe('GET');
    req.flush([{ timestamp: '2026-01-01', RSI: 50, ADX: 20, DMP: 1, DMN: 1, ATR: 1 }]);

    expect(result).toEqual([{ timestamp: '2026-01-01', RSI: 50, ADX: 20, DMP: 1, DMN: 1, ATR: 1 }]);
  });
});
