import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighcharts } from 'highcharts-angular';

import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { AppConfigService } from '../../../../../../services/app-config/app-config-service';
import { ObvWidget } from './obv-widget';

function widget(overrides: Partial<IWidgetConfig> = {}): IWidgetConfig {
  return {
    id: 1,
    user_id: 1,
    dashboard_id: 'assets_analysis',
    label: 'obv',
    title: 'On-Balance Volume (OBV) indicator',
    symbol: 'AAPL',
    content: ObvWidget,
    rows: 1,
    columns: 1,
    background_color: 'var(--mat-sys-surface)',
    color: 'var(--mat-sys-on-surface)',
    ...overrides,
  };
}

describe('ObvWidget', () => {
  let component: ObvWidget;
  let fixture: ComponentFixture<ObvWidget>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObvWidget],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideHighcharts(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ObvWidget);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('data', widget());
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('http://localhost:8000/indicators/obv/')
      .flush({ data_map: { AAPL: { indicator: 'obv', indicator_data: [] } } });

    expect(component).toBeTruthy();
  });

  it('requests the OBV indicator for the resolved symbol on ngOnChanges', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/obv/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL']);
    req.flush({ data_map: { AAPL: { indicator: 'obv', indicator_data: [] } } });
  });

  it('maps the response into ohlc/volume/obv chart series', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/obv/');
    req.flush({
      data_map: {
        AAPL: {
          indicator: 'obv',
          indicator_data: [
            { date: 1700000000, open: 10, high: 12, low: 9, close: 11, volume: 1000, indicator: { obv: 500 } },
          ],
        },
      },
    });

    expect(component.ohlc).toEqual([[1700000000, 10, 12, 9, 11]]);
    expect(component.volume).toEqual([[1700000000, 1000]]);
    expect(component.obv).toEqual([[1700000000, 500]]);
  });
});
