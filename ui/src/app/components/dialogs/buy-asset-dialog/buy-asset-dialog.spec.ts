import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyAssetDialog } from './buy-asset-dialog';

describe('BuyAssetDialog', () => {
  let component: BuyAssetDialog;
  let fixture: ComponentFixture<BuyAssetDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyAssetDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyAssetDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
