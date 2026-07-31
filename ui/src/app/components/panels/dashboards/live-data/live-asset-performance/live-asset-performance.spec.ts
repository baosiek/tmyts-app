import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';

import { PortfolioTransactionModel } from '../../../../../models/portfolio-activity-model';
import { AppConfigService } from '../../../../../services/app-config/app-config-service';
import { IBLivePriceService } from '../../../../../services/ib-services/ib-live-price-service';
import { LoggingService } from '../../../../../services/logging/logging-service';
import { LiveAssetPerformance } from './live-asset-performance';

function transaction(overrides: Partial<PortfolioTransactionModel> = {}): PortfolioTransactionModel {
  return {
    purchase_date: new Date('2024-01-01'),
    quantity: 10,
    asset: 'AAPL',
    asset_name: 'Apple Inc.',
    total_quantity: 10,
    total_commission: 5,
    market_value: 1000,
    average_price: 100,
    broker_name: 'IB',
    ...overrides,
  };
}

describe('LiveAssetPerformance', () => {
  let component: LiveAssetPerformance;
  let fixture: ComponentFixture<LiveAssetPerformance>;
  let httpMock: HttpTestingController;
  let ibLivePrice: jasmine.SpyObj<IBLivePriceService>;
  let logging: jasmine.SpyObj<LoggingService>;

  function flushChain(assets: string[] = ['AAPL']) {
    // Constructed with both userId/portfolioName bound for the first time,
    // ngOnChanges and ngOnInit each independently trigger a transactions
    // fetch on this first change-detection pass, so every step below fires
    // twice (once per chain) rather than once.
    httpMock
      .match('http://localhost:8000/portfolio-transactions/get_all_transactions/main/')
      .forEach((req) => req.flush([transaction()]));
    httpMock
      .match('http://localhost:8000/assets_price_history/latest_prices/')
      .forEach((req) => req.flush(assets.map((asset) => ({ asset, adj_price_close: 110 }))));
    httpMock
      .match('http://localhost:8000/portfolio_holdings/holdings/main')
      .forEach((req) => req.flush([]));
    httpMock
      .match('http://localhost:8000/minute_ohlcv_data/last_minute_data/')
      .forEach((req) => req.flush([]));
  }

  beforeEach(async () => {
    ibLivePrice = jasmine.createSpyObj('IBLivePriceService', ['getPriceStream', 'closeConnection', 'closeAllConnections']);
    ibLivePrice.getPriceStream.and.returnValue(NEVER);
    logging = jasmine.createSpyObj('LoggingService', ['logError']);

    await TestBed.configureTestingModule({
      imports: [LiveAssetPerformance],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: IBLivePriceService, useValue: ibLivePrice },
        { provide: LoggingService, useValue: logging },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LiveAssetPerformance);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('userId', 7);
    fixture.componentRef.setInput('portfolioName', 'main');
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    flushChain();
    expect(component).toBeTruthy();
  });

  it('loads transactions and registers each asset for live pricing', () => {
    fixture.detectChanges();
    flushChain(['AAPL']);

    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].asset).toBe('AAPL');
    expect(component.dataSource.data[0].market_value).toBe(1000);
    expect(ibLivePrice.closeConnection).toHaveBeenCalledWith('AAPL');
    expect(ibLivePrice.getPriceStream).toHaveBeenCalledWith('main', 'AAPL');
  });

  it('logs the error when fetching transactions fails', () => {
    fixture.detectChanges();
    httpMock.match('http://localhost:8000/portfolio-transactions/get_all_transactions/main/').forEach((req) =>
      req.flush({ detail: 'boom' }, { status: 500, statusText: 'Server Error' }),
    );

    expect(logging.logError).toHaveBeenCalled();
  });

  it('ngOnDestroy closes every live-price connection', () => {
    fixture.detectChanges();
    flushChain();

    component.ngOnDestroy();

    expect(ibLivePrice.closeAllConnections).toHaveBeenCalled();
  });
});
