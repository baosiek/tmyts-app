import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { TmytsHoldingsService } from './tmyts-holdings-service';

describe('TmytsHoldingsService', () => {
  let service: TmytsHoldingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(TmytsHoldingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
