import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAssetDialog } from './select-asset-dialog';

describe('SelectAssetDialog', () => {
  let component: SelectAssetDialog;
  let fixture: ComponentFixture<SelectAssetDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAssetDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAssetDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
