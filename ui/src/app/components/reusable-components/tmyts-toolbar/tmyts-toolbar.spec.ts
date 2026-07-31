import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ITmytsToolBar } from '../../../interfaces/tmyts-toolbar-interface';
import { GeneraliDialog } from '../../dialogs/general-dialog/general-dialog';
import { TmytsToolbar } from './tmyts-toolbar';

describe('TmytsToolbar', () => {
  let component: TmytsToolbar;
  let fixture: ComponentFixture<TmytsToolbar>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [TmytsToolbar],
    })
      // MatDialogModule (pulled in via MATERIAL_IMPORTS) re-provides MatDialog
      // at the module-injector level, which sits closer to the component
      // than a root-level TestBed override.
      .overrideComponent(TmytsToolbar, { add: { providers: [{ provide: MatDialog, useValue: dialog }] } })
      .compileComponents();

    fixture = TestBed.createComponent(TmytsToolbar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('data', { id: 'portfolio', title: 'Portfolios' } as ITmytsToolBar);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('add() is a no-op when the toolbar has no configured dialog', () => {
    fixture.componentRef.setInput('data', { id: 'portfolio', title: 'Portfolios' } as ITmytsToolBar);
    fixture.detectChanges();

    component.add();

    expect(dialog.open).not.toHaveBeenCalled();
  });

  it('add() opens the configured dialog and forwards the closed result to notifyParent', () => {
    const toolbar: ITmytsToolBar = {
      id: 'assets_analysis',
      title: 'Asset analysis',
      dialog: {
        dialog_title: 'Select asset',
        button_text: 'Select',
        button_icon: 'search_insights',
        dialog_content: class Dummy {},
      },
    };
    fixture.componentRef.setInput('data', toolbar);
    fixture.detectChanges();

    const result = new Map<string, unknown>([['asset', { asset: 'AAPL' }]]);
    dialog.open.and.returnValue({ afterClosed: () => of(result) } as ReturnType<MatDialog['open']>);

    let emitted: unknown;
    component.notifyParent.subscribe((e) => (emitted = e));

    component.add();

    expect(dialog.open).toHaveBeenCalledWith(
      GeneraliDialog,
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          title: 'Select asset',
          content: toolbar.dialog!.dialog_content,
          data: toolbar,
        }),
      }),
    );
    expect(emitted).toBe(result);
  });
});
