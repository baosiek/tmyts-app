import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncomeDialog } from './add-income-dialog';

describe('AddIncomeDialog', () => {
  let component: AddIncomeDialog;
  let fixture: ComponentFixture<AddIncomeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIncomeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIncomeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
