import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { createPortfolioHolding, PortfolioHoldingsModel } from '../../../../models/portfolio_holdings_model';
import { PortfolioModel } from '../../../../models/portfolio-model';
import { AppConfigService } from '../../../../services/app-config/app-config-service';
import { AuthService } from '../../../../services/auth/auth-service';
import { LiveTracker } from './live-tracker';

function portfolio(overrides: Partial<PortfolioModel> = {}): PortfolioModel {
  return { portfolio_id: 1, user_id: 7, portfolio_name: 'main', description: '', ...overrides };
}

function holding(overrides: Partial<PortfolioHoldingsModel> = {}): PortfolioHoldingsModel {
  return { ...createPortfolioHolding(), price_date: new Date('2024-01-01'), asset: 'AAPL', portfolio_name: 'main', ...overrides };
}

describe('LiveTracker', () => {
  let component: LiveTracker;
  let fixture: ComponentFixture<LiveTracker>;
  let httpMock: HttpTestingController;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  function flushUser(portfolioName: string) {
    httpMock.expectOne('http://localhost:8000/users/get_users').flush({
      user_id: 7, user_name: 'bao', email: 'bao@example.com', theme: 'light', portfolio_name: portfolioName, user_photo: null,
    });
  }

  function flushPortfolios(portfolios: PortfolioModel[]) {
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush(portfolios);
  }

  function flushHoldings(portfolioName: string, holdings: PortfolioHoldingsModel[]) {
    httpMock.expectOne(`http://localhost:8000/portfolio_holdings/holdings/${portfolioName}`).flush(holdings);
  }

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [LiveTracker],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: AuthService, useValue: { userId: () => 7 } },
      ],
    })
      .overrideComponent(LiveTracker, { add: { providers: [{ provide: MatSnackBar, useValue: snackBar }] } })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LiveTracker);
    component = fixture.componentInstance;
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    flushUser('main');
    flushPortfolios([portfolio()]);
    flushHoldings('main', [holding()]);
    expect(component).toBeTruthy();
  });

  it('loads the toolbar config matching this dashboard id', () => {
    flushUser('main');
    flushPortfolios([portfolio()]);
    flushHoldings('main', [holding()]);
    expect(component.toolbar?.id).toBe('live_tracker');
  });

  it('on construction, loads the selected portfolio, the portfolio list, and its holdings', () => {
    flushUser('main');
    flushPortfolios([portfolio({ portfolio_name: 'main' })]);
    flushHoldings('main', [holding({ asset: 'AAPL' })]);

    expect(component.selectedPortfolio).toBe('main');
    expect(component.portfolioList).toEqual([portfolio({ portfolio_name: 'main' })]);
    expect(component.assetsList).toEqual([holding({ asset: 'AAPL' })]);
  });

  it('onPortfolioChange reloads the holdings for the newly selected portfolio', () => {
    flushUser('main');
    flushPortfolios([portfolio({ portfolio_name: 'main' }), portfolio({ portfolio_name: 'second' })]);
    flushHoldings('main', []);

    component.selectedPortfolio = 'second';
    component.onPortfolioChange(null);
    flushHoldings('second', [holding({ asset: 'MSFT', portfolio_name: 'second' })]);

    expect(component.assetsList).toEqual([holding({ asset: 'MSFT', portfolio_name: 'second' })]);
  });

  it('updatePortfolioList shows a snackbar error when the request fails', () => {
    flushUser('main');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush({ detail: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(snackBar.open).toHaveBeenCalled();
  });
});
