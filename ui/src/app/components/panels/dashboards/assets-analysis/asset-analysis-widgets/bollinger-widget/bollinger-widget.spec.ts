import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHighcharts } from 'highcharts-angular';

import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { AppConfigService } from '../../../../../../services/app-config/app-config-service';
import { BollingerWidget } from './bollinger-widget';

function widget(overrides: Partial<IWidgetConfig> = {}): IWidgetConfig {
  return {
    id: 1,
    user_id: 1,
    dashboard_id: 'assets_analysis',
    label: 'bollinger',
    title: 'Bollinger Bands indicator',
    symbol: 'AAPL',
    content: BollingerWidget,
    rows: 1,
    columns: 1,
    background_color: 'var(--mat-sys-surface)',
    color: 'var(--mat-sys-on-surface)',
    ...overrides,
  };
}

describe('BollingerWidget', () => {
  let component: BollingerWidget;
  let fixture: ComponentFixture<BollingerWidget>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BollingerWidget],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideHighcharts(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BollingerWidget);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('data', widget());
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    httpMock
      .expectOne('http://localhost:8000/indicators/bollinger/')
      .flush({ data_map: { AAPL: { indicator: 'bollinger', indicator_data: [] } } });

    expect(component).toBeTruthy();
  });

  it('requests the Bollinger indicator for the resolved symbol on ngOnChanges', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/bollinger/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(['AAPL']);
    req.flush({ data_map: { AAPL: { indicator: 'bollinger', indicator_data: [] } } });
  });

  it('maps the response into ohlc/volume/middle/lower/upper chart series', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/indicators/bollinger/');
    req.flush({
      data_map: {
        AAPL: {
          indicator: 'bollinger',
          indicator_data: [
            {
              date: 1700000000, open: 10, high: 12, low: 9, close: 11, volume: 1000,
              indicator: { middle: 10.5, lower: 9.5, upper: 11.5 },
            },
          ],
        },
      },
    });

    expect(component.ohlc).toEqual([[1700000000, 10, 12, 9, 11]]);
    expect(component.volume).toEqual([[1700000000, 1000]]);
    expect(component.middle).toEqual([[1700000000, 10.5]]);
    expect(component.lower).toEqual([[1700000000, 9.5]]);
    expect(component.upper).toEqual([[1700000000, 11.5]]);
  });
});
