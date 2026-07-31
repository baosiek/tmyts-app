import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { createNewAsset } from '../../../../../models/asset-model';
import { createPortfolioHolding, PortfolioHoldingsModel } from '../../../../../models/portfolio_holdings_model';
import { AppConfigService } from '../../../../../services/app-config/app-config-service';
import { AssetCard } from './asset-card';

function holding(overrides: Partial<PortfolioHoldingsModel> = {}): PortfolioHoldingsModel {
  return { ...createPortfolioHolding(), price_date: new Date('2024-01-01'), asset: 'AAPL', asset_name: 'Apple Inc.', ...overrides };
}

describe('AssetCard', () => {
  let component: AssetCard;
  let fixture: ComponentFixture<AssetCard>;
  let httpMock: HttpTestingController;
  let dialog: jasmine.SpyObj<MatDialog>;

  function flushInitialLoad() {
    httpMock
      .expectOne('http://localhost:8000/minute_ohlcv_data/last_x_minutes_of_data_for_asset/?asset=AAPL')
      .flush([]);
    httpMock
      .expectOne('http://localhost:8000/indicators_ta/all/asset/AAPL/lookback/14/')
      .flush([]);
  }

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [AssetCard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AssetCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('asset', holding());
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    flushInitialLoad();
    expect(component).toBeTruthy();
  });

  it('drops leading invalid bars and carries the last valid price forward for trailing invalid ones', async () => {
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:8000/minute_ohlcv_data/last_x_minutes_of_data_for_asset/?asset=AAPL').flush([
      { asset_id: 1, asset: 'AAPL', timestamp: '2024-01-01T09:30:00Z', open_price: 0, high_price: 0, low_price: 0, close_price: 0, volume: 0 },
      { asset_id: 1, asset: 'AAPL', timestamp: '2024-01-01T09:31:00Z', open_price: 10, high_price: 12, low_price: 9, close_price: 11, volume: 100 },
      { asset_id: 1, asset: 'AAPL', timestamp: '2024-01-01T09:32:00Z', open_price: 0, high_price: 0, low_price: 0, close_price: 0, volume: 50 },
    ]);
    httpMock.expectOne('http://localhost:8000/indicators_ta/all/asset/AAPL/lookback/14/').flush([]);
    // rxResource applies the emitted value to its `value` signal on a
    // microtask, one tick after the synchronous httpMock.flush() call.
    await Promise.resolve();

    const ohlc = component.chartData().ohlc;
    expect(ohlc.length).toBe(2);
    expect(ohlc[0]).toEqual([new Date('2024-01-01T09:31:00Z').getTime(), 10, 12, 9, 11]);
    // Trailing invalid bar carries the last valid entry's prices forward, at its own timestamp.
    expect(ohlc[1]).toEqual([new Date('2024-01-01T09:32:00Z').getTime(), 10, 12, 9, 11]);
  });

  it('computes maxHigh/minLow/avgPrice/latestPrice from the loaded bars', async () => {
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:8000/minute_ohlcv_data/last_x_minutes_of_data_for_asset/?asset=AAPL').flush([
      { asset_id: 1, asset: 'AAPL', timestamp: '2024-01-01T09:30:00Z', open_price: 10, high_price: 15, low_price: 8, close_price: 12, volume: 100 },
      { asset_id: 1, asset: 'AAPL', timestamp: '2024-01-01T09:31:00Z', open_price: 12, high_price: 13, low_price: 10, close_price: 11, volume: 100 },
    ]);
    httpMock.expectOne('http://localhost:8000/indicators_ta/all/asset/AAPL/lookback/14/').flush([]);
    await Promise.resolve();

    expect(component.maxHigh()?.price).toBe(15);
    expect(component.minLow()?.price).toBe(8);
    expect(component.avgPrice()).toBeCloseTo(11.5, 10);
    expect(component.latestPrice()?.price).toBe(11);
  });

  it('toggleFullscreen opens a fullscreen dialog for the current asset', () => {
    fixture.detectChanges();
    flushInitialLoad();

    component.toggleFullscreen();

    expect(dialog.open).toHaveBeenCalledTimes(1);
    const [openedComponent, config] = dialog.open.calls.argsFor(0);
    expect(openedComponent).toBe(AssetCard);
    expect(config?.data).toEqual(holding());
  });

  it('prefers dialog-injected asset data over the asset input when opened as dialog content', async () => {
    await TestBed.resetTestingModule();
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    const { MAT_DIALOG_DATA } = await import('@angular/material/dialog');
    const dialogAsset = holding({ asset: 'MSFT', asset_name: 'Microsoft Corp.' });

    await TestBed.configureTestingModule({
      imports: [AssetCard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: MatDialog, useValue: dialog },
        { provide: MAT_DIALOG_DATA, useValue: dialogAsset },
      ],
    }).compileComponents();

    const dialogHttpMock = TestBed.inject(HttpTestingController);
    const dialogFixture = TestBed.createComponent(AssetCard);
    const dialogComponent = dialogFixture.componentInstance;
    dialogFixture.componentRef.setInput('asset', createNewAsset() as unknown as PortfolioHoldingsModel);
    dialogFixture.detectChanges();

    expect(dialogComponent.asset()).toEqual(dialogAsset);

    dialogHttpMock.match(() => true).forEach((req) => req.flush([]));
  });
});
