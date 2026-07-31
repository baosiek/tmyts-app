import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { PortfolioPerformanceService } from './portfolio-performance-service';

describe('PortfolioPerformanceService', () => {
  let service: PortfolioPerformanceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(PortfolioPerformanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPortfolioTwr GETs /portfolios/twr/{name}/', () => {
    let result: unknown;
    service.getPortfolioTwr('main').subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/portfolios/twr/main/');
    expect(req.request.method).toBe('GET');
    req.flush([{ price_date: '2026-01-01' }]);

    expect(result).toEqual([{ price_date: '2026-01-01' }]);
  });
});
