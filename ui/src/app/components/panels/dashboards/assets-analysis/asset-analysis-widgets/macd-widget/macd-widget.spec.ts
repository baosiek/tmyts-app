import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighcharts } from 'highcharts-angular';

import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { AppConfigService } from '../../../../../../services/app-config/app-config-service';
import { MacdWidget } from './macd-widget';

function widget(overrides: Partial<IWidgetConfig> = {}): IWidgetConfig {
  return {
    id: 1,
    user_id: 1,
    dashboard_id: 'assets_analysis',
    label: 'macd',
    title: 'MACD indicator',
    symbol: 'AAPL',
    content: MacdWidget,
    rows: 1,
    columns: 1,
    background_color: 'var(--mat-sys-surface)',
    color: 'var(--mat-sys-on-surface)',
    ...overrides,
  };
}

describe('MacdWidget', () => {
  let component: MacdWidget;
  let fixture: ComponentFixture<MacdWidget>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MacdWidget],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideHighcharts(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MacdWidget);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('data', widget());
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('http://localhost:8000/indicators/macd/')
      .flush({ data_map: { AAPL: { indicator: 'macd', indicator_data: [] } } });

    expect(component).toBeTruthy();
  });

  it('requests the MACD indicator for the resolved symbol on ngOnChanges', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/macd/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL']);
    req.flush({ data_map: { AAPL: { indicator: 'macd', indicator_data: [] } } });
  });

  it('maps the response into ohlc/macd/signal/histogram chart series', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/macd/');
    req.flush({
      data_map: {
        AAPL: {
          indicator: 'macd',
          indicator_data: [
            {
              date: 1700000000, open: 10, high: 12, low: 9, close: 11, volume: 1000,
              indicator: { macd: 1.5, signal: 1.2, histogram: 0.3 },
            },
          ],
        },
      },
    });

    expect(component.ohlc).toEqual([[1700000000, 10, 12, 9, 11]]);
    expect(component.macd).toEqual([[1700000000, 1.5]]);
    expect(component.signal).toEqual([[1700000000, 1.2]]);
    expect(component.histogram).toEqual([[1700000000, 0.3]]);
  });
});
