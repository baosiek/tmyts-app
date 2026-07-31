import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogData, GeneraliDialog } from './general-dialog';
import { InfoDialog } from '../info-dialog/info-dialog';

describe('GeneraliDialog', () => {
  let component: GeneraliDialog;
  let fixture: ComponentFixture<GeneraliDialog>;
  let dialogData: DialogData;

  beforeEach(async () => {
    dialogData = {
      title: 'On-Balance Volume (OBV) indicator',
      content: InfoDialog,
      data: new Map<string, unknown>([['dataDialog', 'obv']]),
    };

    await TestBed.configureTestingModule({
      imports: [GeneraliDialog],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: dialogData }],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneraliDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the injected MAT_DIALOG_DATA as generalDialogData', () => {
    expect(component.generalDialogData).toBe(dialogData);
  });

  it('forwards generalDialogData to the outlet as dialogInputs.dialogData', () => {
    expect(component.dialogInputs).toEqual({ dialogData });
  });

  it('renders the dialog title', () => {
    const titleEl: HTMLElement = fixture.nativeElement.querySelector('mat-card-title');
    expect(titleEl.textContent).toContain('On-Balance Volume (OBV) indicator');
  });
});
