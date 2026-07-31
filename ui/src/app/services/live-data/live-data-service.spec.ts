import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { LiveDataService } from './live-data-service';

describe('LiveDataService', () => {
  let service: LiveDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(LiveDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAssetData GETs /live/basic-ticker-data/ with the asset as a query param', () => {
    let result: unknown;
    service.getAssetData('AAPL').subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/live/basic-ticker-data/?asset=AAPL');
    expect(req.request.method).toBe('GET');
    req.flush({ symbol: 'AAPL', price: 100 });

    expect(result).toEqual({ symbol: 'AAPL', price: 100 });
  });

  it('getDetailedPortfolioActivity POSTs symbols with portfolio_id as a query param', () => {
    service.getDetailedPortfolioActivity(42, ['AAPL']).subscribe();

    const req = httpMock.expectOne('http://localhost:8000/live/portfolio_performance/?portfolio_id=42');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL']);
    req.flush([]);
  });

  it('getPortfolioHoldingsPerformance POSTs symbols with portfolio_name as a query param', () => {
    service.getPortfolioHoldingsPerformance('main', ['AAPL']).subscribe();

    const req = httpMock.expectOne('http://localhost:8000/live/portfolio_holdings_performance/?portfolio_name=main');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL']);
    req.flush([]);
  });

  it('getIndexesData POSTs the index id list to /live/indexes-data/', () => {
    service.getIndexesData(['^GSPC']).subscribe();

    const req = httpMock.expectOne('http://localhost:8000/live/indexes-data/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['^GSPC']);
    req.flush([]);
  });
});
