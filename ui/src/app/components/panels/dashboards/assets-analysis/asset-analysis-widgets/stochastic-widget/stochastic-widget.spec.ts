import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighcharts } from 'highcharts-angular';

import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { AppConfigService } from '../../../../../../services/app-config/app-config-service';
import { StochasticWidget } from './stochastic-widget';

function widget(overrides: Partial<IWidgetConfig> = {}): IWidgetConfig {
  return {
    id: 1,
    user_id: 1,
    dashboard_id: 'assets_analysis',
    label: 'stochastic',
    title: 'Stochastic indicator',
    symbol: 'AAPL',
    content: StochasticWidget,
    rows: 1,
    columns: 1,
    background_color: 'var(--mat-sys-surface)',
    color: 'var(--mat-sys-on-surface)',
    ...overrides,
  };
}

describe('StochasticWidget', () => {
  let component: StochasticWidget;
  let fixture: ComponentFixture<StochasticWidget>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StochasticWidget],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideHighcharts(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StochasticWidget);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('data', widget());
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('http://localhost:8000/indicators/stochastic/')
      .flush({ data_map: { AAPL: { indicator: 'stochastic', indicator_data: [] } } });

    expect(component).toBeTruthy();
  });

  it('requests the Stochastic indicator for the resolved symbol on ngOnChanges', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/stochastic/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL']);
    req.flush({ data_map: { AAPL: { indicator: 'stochastic', indicator_data: [] } } });
  });

  it('maps the response into ohlc/volume/k_line/d_line chart series', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/stochastic/');
    req.flush({
      data_map: {
        AAPL: {
          indicator: 'stochastic',
          indicator_data: [
            {
              date: 1700000000, open: 10, high: 12, low: 9, close: 11, volume: 1000,
              indicator: { k_line: 80, d_line: 70 },
            },
          ],
        },
      },
    });

    expect(component.ohlc).toEqual([[1700000000, 10, 12, 9, 11]]);
    expect(component.volume).toEqual([[1700000000, 1000]]);
    expect(component.k_line).toEqual([[1700000000, 80]]);
    expect(component.d_line).toEqual([[1700000000, 70]]);
  });
});
