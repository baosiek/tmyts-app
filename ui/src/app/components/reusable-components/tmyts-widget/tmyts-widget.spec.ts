import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { IWidgetConfig } from '../../../interfaces/widget-config-interface';
import { GeneraliDialog } from '../../dialogs/general-dialog/general-dialog';
import { InfoDialog } from '../../dialogs/info-dialog/info-dialog';
import { TmytsWidget } from './tmyts-widget';

class DummyWidgetComponent {}

function widget(overrides: Partial<IWidgetConfig> = {}): IWidgetConfig {
  return {
    id: 1,
    user_id: 7,
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

describe('TmytsWidget', () => {
  let component: TmytsWidget;
  let fixture: ComponentFixture<TmytsWidget>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [TmytsWidget],
    })
      .overrideComponent(TmytsWidget, { add: { providers: [{ provide: MatDialog, useValue: dialog }] } })
      .compileComponents();

    fixture = TestBed.createComponent(TmytsWidget);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('widgetConfig', widget());
    fixture.componentRef.setInput('symbol', 'AAPL');
    fixture.componentRef.setInput('user_id', 7);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('seeds indicatorData from widgetConfig on init and on subsequent changes', () => {
    fixture.detectChanges();
    expect(component.indicatorData()).toEqual({ data: widget() });

    fixture.componentRef.setInput('widgetConfig', widget({ symbol: 'MSFT' }));
    fixture.detectChanges();
    expect(component.indicatorData()).toEqual({ data: widget({ symbol: 'MSFT' }) });
  });

  it('toggleFullscreen opens the widget itself as the dialog content', () => {
    fixture.detectChanges();
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as ReturnType<MatDialog['open']>);

    component.toggleFullscreen();

    const [openedComponent, config] = dialog.open.calls.argsFor(0);
    expect(openedComponent).toBe(GeneraliDialog);
    expect(config?.data.title).toBe(widget().title);
    expect(config?.data.content).toBe(DummyWidgetComponent);
    expect(config?.data.data.get('dataDialog')).toEqual(widget());
  });

  it('openInfoContainer opens the InfoDialog for the widget label', () => {
    fixture.detectChanges();
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as ReturnType<MatDialog['open']>);

    component.openInfoContainer();

    const [openedComponent, config] = dialog.open.calls.argsFor(0);
    expect(openedComponent).toBe(GeneraliDialog);
    expect(config?.data.title).toBe(widget().title);
    expect(config?.data.content).toBe(InfoDialog);
    expect(config?.data.data.get('dataDialog')).toBe('obv');
  });
});
