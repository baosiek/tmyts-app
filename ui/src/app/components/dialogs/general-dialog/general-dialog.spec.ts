import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneraliDialog } from './general-dialog';

describe('GeneraliDialog', () => {
  let component: GeneraliDialog;
  let fixture: ComponentFixture<GeneraliDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneraliDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneraliDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
