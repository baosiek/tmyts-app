import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { LivePerformanceInterface } from '../../interfaces/live-performance-interface';
import { LiveHealthCheck, LivePerformanceDataService } from './live-data';

export const mockLivePerformanceData: LivePerformanceInterface[] = [
  {
    date_price: 1674259200,
    symbol: 'AAPL',
    adj_price_close: 175.0,
    price: 175.2,
    gain_loss: 0.2,
    percent: 0.11,
  },
  {
    date_price: 1674259200,
    symbol: 'GOOG',
    adj_price_close: 2800.0,
    price: 2805.5,
    gain_loss: 5.5,
    percent: 0.2,
  },
  {
    date_price: 1674259200,
    symbol: 'TSLA',
    adj_price_close: 900.0,
    price: 905.0,
    gain_loss: 5.0,
    percent: 0.55,
  },
  {
    date_price: 1674259200,
    symbol: 'MSFT',
    adj_price_close: 300.0,
    price: 301.0,
    gain_loss: 1.0,
    percent: 0.33,
  },
  {
    date_price: 1674259200,
    symbol: 'META',
    adj_price_close: 350.0,
    price: 352.0,
    gain_loss: 2.0,
    percent: 0.57,
  },
  {
    date_price: 1674259200,
    symbol: 'NVDA',
    adj_price_close: 800.0,
    price: 810.0,
    gain_loss: 10.0,
    percent: 1.25,
  },
  {
    date_price: 1674259200,
    symbol: 'AMZN',
    adj_price_close: 170.0,
    price: 171.0,
    gain_loss: 1.0,
    percent: 0.58,
  },
];

@Injectable({
  providedIn: 'root',
})
export class MockLivePerformanceDataService extends LivePerformanceDataService {
  override getStream(url: string): Observable<LivePerformanceInterface> {
    return from(mockLivePerformanceData);
  }
}

@Injectable({
  providedIn: 'root',
})
export class MockLiveHealthCheck extends LiveHealthCheck {
  override checkYFssLive(): Observable<any> {
    return of({ status_code: 200 });
  }
}
