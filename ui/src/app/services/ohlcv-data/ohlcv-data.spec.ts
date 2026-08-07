import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { OhlcvData } from './ohlcv-data';

describe('OhlcvData', () => {
  let service: OhlcvData;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(OhlcvData);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getOhlcvData POSTs the symbol list to /minute_ohlcv_data/last_minute_data/', () => {
    let result: unknown;
    service.getOhlcvData(['AAPL']).subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/minute_ohlcv_data/last_minute_data/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL']);
    req.flush([{ asset: 'AAPL' }]);

    expect(result).toEqual([{ asset: 'AAPL' }]);
  });

  it('getAllBars GETs with the asset as a query param', () => {
    service.getAllBars('AAPL').subscribe();

    const req = httpMock.expectOne('http://localhost:8000/minute_ohlcv_data/last_x_minutes_of_data_for_asset/?asset=AAPL');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
