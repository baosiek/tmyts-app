import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAssetPerformance } from './live-asset-performance';

describe('LiveAssetPerformance', () => {
  let component: LiveAssetPerformance;
  let fixture: ComponentFixture<LiveAssetPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAssetPerformance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveAssetPerformance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
