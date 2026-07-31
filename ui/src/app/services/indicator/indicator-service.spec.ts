import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { IndicatorDataMapModel } from '../../models/indicator-model';
import { AppConfigService } from '../app-config/app-config-service';
import { IndicatorService } from './indicator-service';

describe('IndicatorService', () => {
  let service: IndicatorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(IndicatorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const cases: [string, (s: IndicatorService, symbols: string[]) => Observable<IndicatorDataMapModel>, string][] = [
    ['getObvIndicator', (s, symbols) => s.getObvIndicator(symbols), 'obv'],
    ['getADLineIndicator', (s, symbols) => s.getADLineIndicator(symbols), 'ad_line'],
    ['getADXIndicator', (s, symbols) => s.getADXIndicator(symbols), 'adx'],
    ['getAroonIndicator', (s, symbols) => s.getAroonIndicator(symbols), 'aroon'],
    ['getMACDIndicator', (s, symbols) => s.getMACDIndicator(symbols), 'macd'],
    ['getRSIIndicator', (s, symbols) => s.getRSIIndicator(symbols), 'rsi'],
    ['getStochasticIndicator', (s, symbols) => s.getStochasticIndicator(symbols), 'stochastic'],
    ['getPSARIndicator', (s, symbols) => s.getPSARIndicator(symbols), 'psar'],
    ['getBollingerIndicator', (s, symbols) => s.getBollingerIndicator(symbols), 'bollinger'],
  ];

  for (const [name, call, urlSegment] of cases) {
    it(`${name}() POSTs the symbol list to /indicators/${urlSegment}/`, () => {
      call(service, ['AAPL']).subscribe();

      const req = httpMock.expectOne(`http://localhost:8000/indicators/${urlSegment}/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(['AAPL']);
      req.flush({ data_map: {} });
    });
  }
});
