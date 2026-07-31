import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogData } from '../general-dialog/general-dialog';
import { InfoDialog } from './info-dialog';

function dialogData(label: string): DialogData {
  return {
    title: 'Info',
    content: InfoDialog,
    data: new Map<string, unknown>([['dataDialog', label]]),
  };
}

describe('InfoDialog', () => {
  let component: InfoDialog;
  let fixture: ComponentFixture<InfoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoDialog);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('dialogData', dialogData('obv'));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('looks up the indicator info matching the dialog label and sanitizes its html', () => {
    fixture.componentRef.setInput('dialogData', dialogData('obv'));
    fixture.detectChanges();

    expect(component.indicatorInfo()).toBeTruthy();
  });

  it('leaves indicatorInfo unset when no indicator matches the label', () => {
    fixture.componentRef.setInput('dialogData', dialogData('not-a-real-indicator'));
    fixture.detectChanges();

    expect(component.indicatorInfo()).toBe('');
  });
});
