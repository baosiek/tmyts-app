import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { AssetsPriceHistoryService } from './assets-price-history-service';

describe('AssetsPriceHistoryService', () => {
  let service: AssetsPriceHistoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(AssetsPriceHistoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAssetsLatestPrices POSTs the symbol list to /assets_price_history/latest_prices/', () => {
    let result: unknown;
    service.getAssetsLatestPrices(['AAPL', 'GOOG']).subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/assets_price_history/latest_prices/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL', 'GOOG']);
    req.flush([{ asset: 'AAPL', adj_price_close: 100 }]);

    expect(result).toEqual([{ asset: 'AAPL', adj_price_close: 100 }]);
  });
});
