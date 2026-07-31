import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IWidgetConfig } from '../../interfaces/widget-config-interface';
import { AppConfigService } from '../app-config/app-config-service';
import { AssetsAnalysisDashboardService } from './assets-analysis-dashboard-service';

class DummyWidgetComponent {}

function widget(overrides: Partial<IWidgetConfig> = {}): IWidgetConfig {
  return {
    id: 1,
    user_id: 1,
    dashboard_id: 'assets_analysis',
    label: 'obv',
    title: 'On-Balance Volume (OBV) indicator',
    symbol: 'AAPL',
    content: DummyWidgetComponent,
    rows: 1,
    columns: 1,
    background_color: 'var(--mat-sys-surface)',
    color: 'var(--mat-sys-on-surface)',
    ...overrides,
  };
}

describe('AssetsAnalysisDashboardService', () => {
  let service: AssetsAnalysisDashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssetsAnalysisDashboardService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
      ],
    });
    service = TestBed.inject(AssetsAnalysisDashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('widgetsToBeAdded excludes widget types already in widgetsInDashboard', () => {
    expect(service.widgetsToBeAdded().length).toBe(service.widgetTypes().length);

    service.widgetsInDashboard.set([widget({ id: 1, label: 'obv' })]);

    const remainingIds = service.widgetsToBeAdded().map((w) => w.id);
    expect(remainingIds).not.toContain(1);
    expect(remainingIds.length).toBe(service.widgetTypes().length - 1);
  });

  it('addWidgetToDashboard strips content before POSTing, then adds the response back with content restored', () => {
    service.addWidgetToDashboard(1, 'AAPL', service.widgetTypes()[0]);

    const req = httpMock.expectOne('http://localhost:8000/dashboard_widget_config/insert/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.content).toBeUndefined();
    req.flush({ ...req.request.body, id: 1 });

    expect(service.widgetsInDashboard().length).toBe(1);
    expect(service.widgetsInDashboard()[0].content).toBe(service.widgetTypes()[0].content);
  });

  it('updateWidget merges the patch, PUTs it, and updates state from the response', () => {
    service.widgetsInDashboard.set([widget({ id: 1, dashboard_id: 'assets_analysis' })]);

    service.updateWidget({ id: 1, color: '#ffffff' });

    const req = httpMock.expectOne('http://localhost:8000/dashboard_widget_config/update/?dashboard_id=assets_analysis');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body[0].color).toBe('#ffffff');
    req.flush([{ ...widget({ id: 1 }), color: '#ffffff', content: undefined }]);

    expect(service.widgetsInDashboard()[0].color).toBe('#ffffff');
  });

  it('updateWidget is a no-op when the widget id is not in widgetsInDashboard', () => {
    service.widgetsInDashboard.set([widget({ id: 1 })]);

    service.updateWidget({ id: 999, color: '#ffffff' });

    httpMock.expectNone(() => true);
    expect(service.widgetsInDashboard()[0].color).not.toBe('#ffffff');
  });

  it('deleteWidgetFromDashboard DELETEs and replaces widgetsInDashboard from the response', () => {
    service.widgetsInDashboard.set([widget({ id: 1 })]);

    service.deleteWidgetFromDashboard(widget({ id: 1 }));

    const req = httpMock.expectOne('http://localhost:8000/dashboard_widget_config/delete/?id=1&dashboard_id=assets_analysis');
    expect(req.request.method).toBe('DELETE');
    req.flush([]);

    expect(service.widgetsInDashboard()).toEqual([]);
  });
});
