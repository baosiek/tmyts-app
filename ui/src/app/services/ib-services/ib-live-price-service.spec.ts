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
});
