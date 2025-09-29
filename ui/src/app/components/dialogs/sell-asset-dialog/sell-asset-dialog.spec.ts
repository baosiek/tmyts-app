import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellAssetDialog } from './sell-asset-dialog';

describe('SellAssetDialog', () => {
  let component: SellAssetDialog;
  let fixture: ComponentFixture<SellAssetDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellAssetDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellAssetDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
