import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighcharts } from 'highcharts-angular';

import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { AppConfigService } from '../../../../../../services/app-config/app-config-service';
import { AdlineWidget } from './adline-widget';

function widget(overrides: Partial<IWidgetConfig> = {}): IWidgetConfig {
  return {
    id: 1,
    user_id: 1,
    dashboard_id: 'assets_analysis',
    label: 'ad_line',
    title: 'A/D Line indicator',
    symbol: 'AAPL',
    content: AdlineWidget,
    rows: 1,
    columns: 1,
    background_color: 'var(--mat-sys-surface)',
    color: 'var(--mat-sys-on-surface)',
    ...overrides,
  };
}

describe('AdlineWidget', () => {
  let component: AdlineWidget;
  let fixture: ComponentFixture<AdlineWidget>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdlineWidget],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideHighcharts(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdlineWidget);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('data', widget());
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('http://localhost:8000/indicators/ad_line/')
      .flush({ data_map: { AAPL: { indicator: 'ad_line', indicator_data: [] } } });

    expect(component).toBeTruthy();
  });

  it('requests the AD Line indicator for the resolved symbol on ngOnChanges', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/ad_line/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL']);
    req.flush({ data_map: { AAPL: { indicator: 'ad_line', indicator_data: [] } } });
  });

  it('maps the response into ohlc/volume/adLine chart series', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/ad_line/');
    req.flush({
      data_map: {
        AAPL: {
          indicator: 'ad_line',
          indicator_data: [
            {
              date: 1700000000, open: 10, high: 12, low: 9, close: 11, volume: 1000,
              indicator: { ad_line: 12345 },
            },
          ],
        },
      },
    });

    expect(component.ohlc).toEqual([[1700000000, 10, 12, 9, 11]]);
    expect(component.volume).toEqual([[1700000000, 1000]]);
    expect(component.adLine).toEqual([[1700000000, 12345]]);
  });
});
