import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighcharts } from 'highcharts-angular';

import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { AppConfigService } from '../../../../../../services/app-config/app-config-service';
import { SarWidget } from './sar-widget';

function widget(overrides: Partial<IWidgetConfig> = {}): IWidgetConfig {
  return {
    id: 1,
    user_id: 1,
    dashboard_id: 'assets_analysis',
    label: 'psar',
    title: 'Parabolic SAR indicator',
    symbol: 'AAPL',
    content: SarWidget,
    rows: 1,
    columns: 1,
    background_color: 'var(--mat-sys-surface)',
    color: 'var(--mat-sys-on-surface)',
    ...overrides,
  };
}

describe('SarWidget', () => {
  let component: SarWidget;
  let fixture: ComponentFixture<SarWidget>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SarWidget],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideHighcharts(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SarWidget);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('data', widget());
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('http://localhost:8000/indicators/psar/')
      .flush({ data_map: { AAPL: { indicator: 'psar', indicator_data: [] } } });

    expect(component).toBeTruthy();
  });

  it('requests the PSAR indicator for the resolved symbol on ngOnChanges', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/psar/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL']);
    req.flush({ data_map: { AAPL: { indicator: 'psar', indicator_data: [] } } });
  });

  it('maps the response into ohlc/volume/psar chart series', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/psar/');
    req.flush({
      data_map: {
        AAPL: {
          indicator: 'psar',
          indicator_data: [
            {
              date: 1700000000, open: 10, high: 12, low: 9, close: 11, volume: 1000,
              indicator: { psar: 8.9 },
            },
          ],
        },
      },
    });

    expect(component.ohlc).toEqual([[1700000000, 10, 12, 9, 11]]);
    expect(component.volume).toEqual([[1700000000, 1000]]);
    expect(component.psar).toEqual([[1700000000, 8.9]]);
  });
});
