import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IWidgetConfig } from '../../../../interfaces/widget-config-interface';
import { AppConfigService } from '../../../../services/app-config/app-config-service';
import { AuthService } from '../../../../services/auth/auth-service';
import { ObvWidget } from './asset-analysis-widgets/obv-widget/obv-widget';
import { AssetsAnalysis } from './assets-analysis';

function rawWidget(overrides: Partial<IWidgetConfig> = {}): IWidgetConfig {
  return {
    id: 1,
    user_id: 7,
    dashboard_id: 'assets_analysis',
    label: 'obv',
    title: 'On-Balance Volume (OBV) indicator',
    symbol: 'AAPL',
    content: ObvWidget,
    rows: 1,
    columns: 1,
    background_color: 'var(--mat-sys-surface)',
    color: 'var(--mat-sys-on-surface)',
    ...overrides,
  };
}

describe('AssetsAnalysis', () => {
  let component: AssetsAnalysis;
  let fixture: ComponentFixture<AssetsAnalysis>;
  let httpMock: HttpTestingController;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  function flushWidgets(widgets: IWidgetConfig[]) {
    httpMock.expectOne('http://localhost:8000/dashboard_widget_config/get_all/?dashboard_id=assets_analysis').flush(widgets);
  }

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'openFromComponent']);

    await TestBed.configureTestingModule({
      imports: [AssetsAnalysis],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: AuthService, useValue: { userId: () => 7 } },
      ],
    })
      .overrideComponent(AssetsAnalysis, { add: { providers: [{ provide: MatSnackBar, useValue: snackBar }] } })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AssetsAnalysis);
    component = fixture.componentInstance;
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    flushWidgets([]);
    expect(component).toBeTruthy();
  });

  it('loads the toolbar config matching this dashboard id', () => {
    flushWidgets([]);
    expect(component.data?.id).toBe('assets_analysis');
  });

  it("on construction, loads saved widgets and selects the first widget's symbol", () => {
    flushWidgets([rawWidget({ symbol: 'AAPL' })]);

    expect(component.asset()).toBe('AAPL');
    expect(component.widgetConfigService.widgetsInDashboard().length).toBe(1);
    expect(component.widgetConfigService.widgetsInDashboard()[0].content).toBe(ObvWidget);
  });

  it('leaves asset empty when there are no saved widgets', () => {
    flushWidgets([]);

    expect(component.asset()).toBe('');
  });

  it('parentNotified updates every widget symbol and persists the change', () => {
    flushWidgets([rawWidget({ symbol: 'AAPL' })]);

    const selection = new Map<string, unknown>([['asset', { asset: 'MSFT' }]]);
    component.parentNotified(selection);

    expect(component.asset()).toBe('MSFT');

    const req = httpMock.expectOne('http://localhost:8000/dashboard_widget_config/update/?dashboard_id=assets_analysis');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body[0].symbol).toBe('MSFT');
    req.flush([rawWidget({ symbol: 'MSFT' })]);

    expect(component.widgetConfigService.widgetsInDashboard()[0].symbol).toBe('MSFT');
  });

  it('drop reorders the dashboard widgets and persists the new order', () => {
    flushWidgets([rawWidget({ id: 1, label: 'obv' }), rawWidget({ id: 2, label: 'ad-line' })]);

    component.drop({ previousIndex: 0, currentIndex: 1 } as unknown as CdkDragDrop<string[]>);

    const req = httpMock.expectOne('http://localhost:8000/dashboard_widget_config/update/?dashboard_id=assets_analysis');
    expect(req.request.body.map((w: IWidgetConfig) => w.id)).toEqual([2, 1]);
    req.flush([rawWidget({ id: 2, label: 'ad-line' }), rawWidget({ id: 1, label: 'obv' })]);
  });
});
