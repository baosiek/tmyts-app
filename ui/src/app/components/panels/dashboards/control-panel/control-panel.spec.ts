import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { createPortfolioHolding, PortfolioHoldingsModel } from '../../../../models/portfolio_holdings_model';
import { PortfolioModel } from '../../../../models/portfolio-model';
import { AppConfigService } from '../../../../services/app-config/app-config-service';
import { AuthService } from '../../../../services/auth/auth-service';
import { ControlPanel } from './control-panel';

function portfolio(overrides: Partial<PortfolioModel> = {}): PortfolioModel {
  return { portfolio_id: 1, user_id: 7, portfolio_name: 'main', description: '', ...overrides };
}

function holding(overrides: Partial<PortfolioHoldingsModel> = {}): PortfolioHoldingsModel {
  return { ...createPortfolioHolding(), price_date: new Date('2024-01-01'), asset: 'AAPL', portfolio_name: 'main', ...overrides };
}

describe('ControlPanel', () => {
  let component: ControlPanel;
  let fixture: ComponentFixture<ControlPanel>;
  let httpMock: HttpTestingController;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  function flushUser(portfolioName: string) {
    httpMock.expectOne('http://localhost:8000/users/get_users').flush({
      user_id: 7, user_name: 'bao', email: 'bao@example.com', theme: 'light', portfolio_name: portfolioName, user_photo: null,
    });
  }

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [ControlPanel],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: AuthService, useValue: { userId: () => 7 } },
      ],
    })
      .overrideComponent(ControlPanel, { add: { providers: [{ provide: MatSnackBar, useValue: snackBar }] } })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ControlPanel);
    component = fixture.componentInstance;
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    flushUser('main');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([portfolio()]);
    httpMock.expectOne('http://localhost:8000/portfolio_holdings/holdings/main').flush([holding()]);
    expect(component).toBeTruthy();
  });

  it('loads the toolbar config matching this dashboard id', () => {
    flushUser('main');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([portfolio()]);
    httpMock.expectOne('http://localhost:8000/portfolio_holdings/holdings/main').flush([holding()]);
    expect(component.toolbar?.id).toBe('control-panel');
  });

  it('on construction with a pre-selected portfolio, loads the portfolio list and forwards its holdings to children', () => {
    flushUser('main');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([portfolio({ portfolio_name: 'main' })]);
    httpMock.expectOne('http://localhost:8000/portfolio_holdings/holdings/main').flush([holding({ asset: 'AAPL' })]);

    expect(component.selectedPortfolio).toBe('main');
    expect(component.portfolioList).toEqual([portfolio({ portfolio_name: 'main' })]);
    expect(component.dataExchangeToChild.asset_list).toEqual(['AAPL']);
    expect(component.dataExchangeToChild.portfolio_name).toBe('main');
  });

  it('falls back to the first portfolio and loads its holdings when the user has none selected', () => {
    flushUser('');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([portfolio({ portfolio_name: 'first' })]);
    httpMock.expectOne('http://localhost:8000/portfolio_holdings/holdings/first').flush([holding({ asset: 'MSFT', portfolio_name: 'first' })]);

    expect(component.selectedPortfolio).toBe('first');
    expect(component.dataExchangeToChild.asset_list).toEqual(['MSFT']);
  });

  it('onPortfolioChange resets dataExchangeToChild when no portfolio is selected', () => {
    flushUser('main');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([portfolio()]);
    httpMock.expectOne('http://localhost:8000/portfolio_holdings/holdings/main').flush([holding()]);

    component.selectedPortfolio = '';
    component.onPortfolioChange();

    expect(component.dataExchangeToChild.portfolio_name).toBe('');
    expect(component.dataExchangeToChild.asset_list).toEqual([]);
  });

  it('onPortfolioChange shows a snackbar error when fetching holdings fails', () => {
    flushUser('main');
    httpMock.expectOne('http://localhost:8000/portfolios/get_all/').flush([portfolio()]);
    httpMock
      .expectOne('http://localhost:8000/portfolio_holdings/holdings/main')
      .flush({ detail: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(snackBar.open).toHaveBeenCalled();
  });
});
