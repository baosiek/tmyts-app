import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralToolbarObject } from './general-toolbar-object';

describe('GeneralToolbarObject', () => {
  let component: GeneralToolbarObject;
  let fixture: ComponentFixture<GeneralToolbarObject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralToolbarObject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralToolbarObject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
