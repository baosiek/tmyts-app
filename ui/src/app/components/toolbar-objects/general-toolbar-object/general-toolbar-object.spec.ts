import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITmytsToolBar } from '../../../interfaces/tmyts-toolbar-interface';
import { ToolbarService } from '../../../services/tmyts-toolbar/tmyts-toolbar-service';
import { GeneralToolbarObject } from './general-toolbar-object';

describe('GeneralToolbarObject', () => {
  let component: GeneralToolbarObject;
  let fixture: ComponentFixture<GeneralToolbarObject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralToolbarObject],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralToolbarObject);
    component = fixture.componentInstance;

    const data: ITmytsToolBar = { id: 'live_data', title: 'Live data' };
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the injected ToolbarService to the outlet as dialogInputs.object', () => {
    const toolbarService = TestBed.inject(ToolbarService);
    expect(component.dialogInputs).toEqual({ object: toolbarService });
  });
});
