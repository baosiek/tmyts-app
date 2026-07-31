import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConfigService } from '../../../../../services/app-config/app-config-service';
import { LoggingService } from '../../../../../services/logging/logging-service';
import { LivePortfolioPerformance } from './live-portfolio-performance';

describe('LivePortfolioPerformance', () => {
  let component: LivePortfolioPerformance;
  let fixture: ComponentFixture<LivePortfolioPerformance>;
  let httpMock: HttpTestingController;
  let logging: jasmine.SpyObj<LoggingService>;

  beforeEach(async () => {
    logging = jasmine.createSpyObj('LoggingService', ['logError']);

    await TestBed.configureTestingModule({
      imports: [LivePortfolioPerformance],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: LoggingService, useValue: logging },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LivePortfolioPerformance);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('userId', 7);
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.componentRef.setInput('portfolioName', 'main');
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:8000/portfolios/twr/main/').flush([]);

    expect(component).toBeTruthy();
  });

  it('fetches the TWR series for the selected portfolio', () => {
    fixture.componentRef.setInput('portfolioName', 'main');
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8000/portfolios/twr/main/');
    expect(req.request.method).toBe('GET');
    const twr = [{ price_date: new Date('2024-01-01'), market_value: 1000, cash_flow: 0, daily_return_pct: 0.01, cumulative_twr_pct: 0.01 }];
    req.flush(twr);

    expect(component.dataSource.data).toEqual(twr);
  });

  it('skips the request when no portfolio is selected', () => {
    fixture.componentRef.setInput('portfolioName', '');
    fixture.detectChanges();

    httpMock.expectNone(() => true);
    expect(component.dataSource.data).toEqual([]);
  });

  it('logs the error when the request fails', () => {
    fixture.componentRef.setInput('portfolioName', 'main');
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:8000/portfolios/twr/main/').flush({ detail: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(logging.logError).toHaveBeenCalled();
  });
});
