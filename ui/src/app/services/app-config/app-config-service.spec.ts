import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from './app-config-service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('apiBaseUrl/wsBaseUrl throw before load() has resolved', () => {
    expect(() => service.apiBaseUrl).toThrowError(/must resolve before config is read/);
    expect(() => service.wsBaseUrl).toThrowError(/must resolve before config is read/);
  });

  it('load() fetches /config.json and populates apiBaseUrl/wsBaseUrl', async () => {
    const loadPromise = service.load();

    const req = httpMock.expectOne('/config.json');
    expect(req.request.method).toBe('GET');
    req.flush({ apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' });

    await loadPromise;

    expect(service.apiBaseUrl).toBe('http://localhost:8000');
    expect(service.wsBaseUrl).toBe('ws://localhost:8001');
  });

  it('load() rejects if the /config.json request fails', async () => {
    const loadPromise = service.load();

    httpMock.expectOne('/config.json').flush('not found', { status: 404, statusText: 'Not Found' });

    await expectAsync(loadPromise).toBeRejected();
    expect(() => service.apiBaseUrl).toThrowError(/must resolve before config is read/);
  });
});
