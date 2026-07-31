import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfigService } from '../app-config/app-config-service';
import { UserPreferencesService } from './user-preferences-service';

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(UserPreferencesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('insertWidgetConfig POSTs to /dashboard_widget_config/insert/', () => {
    service.insertWidgetConfig({ dashboard_id: 'assets_analysis' }).subscribe();

    const req = httpMock.expectOne('http://localhost:8000/dashboard_widget_config/insert/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ dashboard_id: 'assets_analysis' });
    req.flush({ dashboard_id: 'assets_analysis' });
  });

  it('getAllWidgets GETs /dashboard_widget_config/get_all/ with no user_id in the URL', () => {
    let result: unknown;
    service.getAllWidgets('assets_analysis').subscribe((r) => (result = r));

    const req = httpMock.expectOne('http://localhost:8000/dashboard_widget_config/get_all/?dashboard_id=assets_analysis');
    expect(req.request.method).toBe('GET');
    req.flush([{ dashboard_id: 'assets_analysis' }]);

    expect(result).toEqual([{ dashboard_id: 'assets_analysis' }]);
  });

  it('updateWidgets PUTs to /dashboard_widget_config/update/ with no user_id in the URL', () => {
    service.updateWidgets('assets_analysis', [{ dashboard_id: 'assets_analysis' } as never]).subscribe();

    const req = httpMock.expectOne('http://localhost:8000/dashboard_widget_config/update/?dashboard_id=assets_analysis');
    expect(req.request.method).toBe('PUT');
    req.flush([]);
  });

  it('deleteWidget DELETEs /dashboard_widget_config/delete/ with id and dashboard_id as query params', () => {
    service.deleteWidget(7, 'assets_analysis').subscribe();

    const req = httpMock.expectOne('http://localhost:8000/dashboard_widget_config/delete/?id=7&dashboard_id=assets_analysis');
    expect(req.request.method).toBe('DELETE');
    req.flush([]);
  });
});
