import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { PortfolioDatabaseService } from './portfolio-database-service';

describe('PortfolioDatabaseService', () => {
  let service: PortfolioDatabaseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(PortfolioDatabaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createPortfolio POSTs to /portfolios/ with no user_id in the body', () => {
    service.createPortfolio({ portfolio_name: 'main', description: 'desc' }).subscribe();

    const req = httpMock.expectOne('http://localhost:8000/portfolios/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ portfolio_name: 'main', description: 'desc' });
    req.flush({ portfolio_id: 1, portfolio_name: 'main' });
  });

  it('readAllPortfolios GETs /portfolios/get_all/ with no user_id in the URL', () => {
    let result: unknown;
    service.readAllPortfolios().subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/portfolios/get_all/');
    expect(req.request.method).toBe('GET');
    req.flush([{ portfolio_id: 1, portfolio_name: 'main' }]);

    expect(result).toEqual([{ portfolio_id: 1, portfolio_name: 'main' }]);
  });

  it('getPortfolioHoldings GETs /portfolio_holdings/holdings/{name} with no user_id in the URL', () => {
    service.getPortfolioHoldings('main').subscribe();

    const req = httpMock.expectOne('http://localhost:8000/portfolio_holdings/holdings/main');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
