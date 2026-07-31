import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PortfolioComponentsDataExchange } from '../../../../../../interfaces/portfolio-components-data-exchange';
import { createPortfolioHolding, PortfolioHoldingsModel } from '../../../../../../models/portfolio_holdings_model';
import { AppConfigService } from '../../../../../../services/app-config/app-config-service';
import { PortfolioHoldingsTable } from './portfolio-holdings-table';

function holding(overrides: Partial<PortfolioHoldingsModel> = {}): PortfolioHoldingsModel {
  return { ...createPortfolioHolding(), price_date: new Date('2024-01-01'), asset: 'AAPL', portfolio_name: 'main', ...overrides };
}

describe('PortfolioHoldingsTable', () => {
  let component: PortfolioHoldingsTable;
  let fixture: ComponentFixture<PortfolioHoldingsTable>;
  let httpMock: HttpTestingController;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [PortfolioHoldingsTable],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    })
      .overrideComponent(PortfolioHoldingsTable, { add: { providers: [{ provide: MatSnackBar, useValue: snackBar }] } })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(PortfolioHoldingsTable);
    component = fixture.componentInstance;
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.componentRef.setInput('userId', 7);
    fixture.componentRef.setInput('portfolioName', 'main');
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:8000/portfolio_holdings/holdings/main').flush([holding()]);

    expect(component).toBeTruthy();
  });

  it('fetches holdings and emits the exchange data for the selected portfolio', () => {
    fixture.componentRef.setInput('userId', 7);
    fixture.componentRef.setInput('portfolioName', 'main');

    let emitted: unknown;
    component.portfolioExchangeData.subscribe((e) => (emitted = e));

    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/portfolio_holdings/holdings/main');
    expect(req.request.method).toBe('GET');
    req.flush([holding({ asset: 'AAPL' }), holding({ asset: 'MSFT' })]);

    expect(component.dataSource.data).toEqual([holding({ asset: 'AAPL' }), holding({ asset: 'MSFT' })]);
    expect(emitted).toEqual(PortfolioComponentsDataExchange.create(7, 'main', ['AAPL', 'MSFT']));
  });

  it('clears the table and skips the request when no portfolio is selected', () => {
    fixture.componentRef.setInput('userId', 7);
    fixture.componentRef.setInput('portfolioName', '');
    fixture.detectChanges();

    httpMock.expectNone(() => true);
    expect(component.dataSource.data).toEqual([]);
  });

  it('shows a snackbar error when the request fails', () => {
    fixture.componentRef.setInput('userId', 7);
    fixture.componentRef.setInput('portfolioName', 'main');
    fixture.detectChanges();

    httpMock
      .expectOne('http://localhost:8000/portfolio_holdings/holdings/main')
      .flush({ detail: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(snackBar.openFromComponent).toHaveBeenCalled();
  });
});
