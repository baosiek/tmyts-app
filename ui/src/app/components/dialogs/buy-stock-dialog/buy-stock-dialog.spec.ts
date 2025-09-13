import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyStockDialog } from './buy-stock-dialog';

describe('BuyStockDialog', () => {
  let component: BuyStockDialog;
  let fixture: ComponentFixture<BuyStockDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyStockDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyStockDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
