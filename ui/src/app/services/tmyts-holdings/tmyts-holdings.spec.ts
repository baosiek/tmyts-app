import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { TmytsHoldingsService } from './tmyts-holdings-service';

describe('TmytsHoldingsService', () => {
  let service: TmytsHoldingsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(TmytsHoldingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getHoldings GETs /portfolio_holdings/holdings/{name} with no user_id in the URL', () => {
    let result: unknown;
    service.getHoldings('main').subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/portfolio_holdings/holdings/main');
    expect(req.request.method).toBe('GET');
    req.flush([{ asset: 'AAPL' }]);

    expect(result).toEqual([{ asset: 'AAPL' }]);
  });
});
