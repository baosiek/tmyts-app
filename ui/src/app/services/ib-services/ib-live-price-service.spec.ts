import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { IBLivePriceService } from './ib-live-price-service';

describe('IBLivePriceService', () => {
  let service: IBLivePriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(IBLivePriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPriceStream returns an Observable without opening a connection until subscribed', () => {
    // Not subscribing: rxjs's webSocket() only opens the underlying
    // connection lazily on subscribe, so this exercises the "create and
    // cache" branch without a real network dependency in the test.
    const stream = service.getPriceStream('main', 'AAPL');

    expect(stream).toBeTruthy();
    expect(typeof stream.subscribe).toBe('function');
  });

  it('closeConnection on a symbol with no active socket is a safe no-op', () => {
    expect(() => service.closeConnection('AAPL')).not.toThrow();
  });

  it('closeAllConnections with no active sockets is a safe no-op', () => {
    expect(() => service.closeAllConnections()).not.toThrow();
  });

  it('closeConnection after getPriceStream removes the cached socket without throwing', () => {
    service.getPriceStream('main', 'AAPL');
    expect(() => service.closeConnection('AAPL')).not.toThrow();
    // Closing again is a no-op since the socket was already removed.
    expect(() => service.closeConnection('AAPL')).not.toThrow();
  });
});
