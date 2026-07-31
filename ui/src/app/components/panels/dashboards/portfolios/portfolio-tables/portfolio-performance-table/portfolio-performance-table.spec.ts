import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PortfolioComponentsDataExchange } from '../../../../../../interfaces/portfolio-components-data-exchange';
import { AppConfigService } from '../../../../../../services/app-config/app-config-service';
import { PortfolioPerformanceTable } from './portfolio-performance-table';

describe('PortfolioPerformanceTable', () => {
  let component: PortfolioPerformanceTable;
  let fixture: ComponentFixture<PortfolioPerformanceTable>;
  let httpMock: HttpTestingController;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [PortfolioPerformanceTable],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    })
      .overrideComponent(PortfolioPerformanceTable, { add: { providers: [{ provide: MatSnackBar, useValue: snackBar }] } })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PortfolioPerformanceTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('userId', 7);
    fixture.componentRef.setInput('portfolioName', 'main');
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.componentRef.setInput('dataExchangeFromParent', PortfolioComponentsDataExchange.create(7, '', []));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('fetches performance for the unique assets and derives gain_loss/weighted_percent', () => {
    fixture.componentRef.setInput(
      'dataExchangeFromParent',
      PortfolioComponentsDataExchange.create(7, 'main', ['AAPL', 'AAPL', 'MSFT']),
    );
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/live/portfolio_holdings_performance/?portfolio_name=main');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL', 'MSFT']);

    req.flush([
      { asset: 'AAPL', asset_name: 'Apple Inc.', quantity: 10, cost_basis_price: 100, close: 120 },
    ]);

    expect(component.dataSource.data).toEqual([
      { asset: 'AAPL', asset_name: 'Apple Inc.', quantity: 10, cost_basis_price: 100, close: 120, gain_loss: 200, weighted_percent: 0.2 },
    ]);
  });

  it('clears the table when there is no selected portfolio', () => {
    fixture.componentRef.setInput('dataExchangeFromParent', PortfolioComponentsDataExchange.create(7, '', []));
    fixture.detectChanges();

    httpMock.expectNone(() => true);
    expect(component.dataSource.data).toEqual([]);
  });

  it('shows a snackbar error when the request fails', () => {
    fixture.componentRef.setInput('dataExchangeFromParent', PortfolioComponentsDataExchange.create(7, 'main', ['AAPL']));
    fixture.detectChanges();

    httpMock
      .expectOne('http://localhost:8000/live/portfolio_holdings_performance/?portfolio_name=main')
      .flush({ detail: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(snackBar.openFromComponent).toHaveBeenCalled();
  });

  it('computes portfolio totals from the loaded data', () => {
    fixture.componentRef.setInput('dataExchangeFromParent', PortfolioComponentsDataExchange.create(7, 'main', ['AAPL']));
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:8000/live/portfolio_holdings_performance/?portfolio_name=main').flush([
      { asset: 'AAPL', asset_name: 'Apple Inc.', quantity: 10, cost_basis_price: 100, close: 120 },
    ]);

    expect(component.getInitialValue()).toBe(1000);
    expect(component.getCurrentValue()).toBe(1200);
    expect(component.getTotalGainAnLoss()).toBe(200);
    expect(component.getTotalPercent()).toBeCloseTo(0.2, 10);
  });
});
