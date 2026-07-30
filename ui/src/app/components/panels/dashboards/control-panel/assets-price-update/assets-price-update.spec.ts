import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsPriceUpdate } from './assets-price-update';

describe('AssetsPriceUpdate', () => {
  let component: AssetsPriceUpdate;
  let fixture: ComponentFixture<AssetsPriceUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsPriceUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsPriceUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
