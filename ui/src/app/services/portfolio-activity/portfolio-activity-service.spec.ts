import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { PortfolioActivityService } from './portfolio-activity-service';

describe('PortfolioActivityService', () => {
  let service: PortfolioActivityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(PortfolioActivityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('insertNewActivity POSTs to /portfolio-transactions/', () => {
    const activity = { user_id: 1, portfolio_name: 'main', asset: 'AAPL', quantity: 1, purchase_price: 100, purchase_date: new Date(), broker_id: 1 };
    service.insertNewActivity(activity).subscribe();

    const req = httpMock.expectOne('http://localhost:8000/portfolio-transactions/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(activity);
    req.flush({ status_code: 200, message: 'ok' });
  });

  it('addSellTransaction POSTs to /portfolio-transactions/', () => {
    service.addSellTransaction({ asset: 'AAPL' }).subscribe();

    const req = httpMock.expectOne('http://localhost:8000/portfolio-transactions/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ asset: 'AAPL' });
    req.flush({ status_code: 200, message: 'ok' });
  });

  it('getTransactionsForPortfolio GETs /portfolio-transactions/get_all_transactions/{name}/ with no user_id', () => {
    let result: unknown;
    service.getTransactionsForPortfolio('main').subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/portfolio-transactions/get_all_transactions/main/');
    expect(req.request.method).toBe('GET');
    req.flush([{ asset: 'AAPL' }]);

    expect(result).toEqual([{ asset: 'AAPL' }]);
  });

  it('deleteActivityForPortfolio DELETEs /portfolio-transactions/{id}', () => {
    service.deleteActivityForPortfolio(7).subscribe();

    const req = httpMock.expectOne('http://localhost:8000/portfolio-transactions/7');
    expect(req.request.method).toBe('DELETE');
    req.flush([]);
  });
});
