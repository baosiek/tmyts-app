import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { QuickSearchService } from './quick-search-service';

describe('QuickSearchService', () => {
  let service: QuickSearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(QuickSearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('quickSearch GETs /assets/quick_search/ with the term as a query param', () => {
    let result: unknown;
    service.quickSearch('AAP').subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/assets/quick_search/?search_term=AAP');
    expect(req.request.method).toBe('GET');
    req.flush([{ asset: 'AAPL' }]);

    expect(result).toEqual([{ asset: 'AAPL' }]);
  });
});
