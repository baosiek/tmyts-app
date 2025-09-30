import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAnalysis } from './asset-analysis';

describe('AssetAnalysis', () => {
  let component: AssetAnalysis;
  let fixture: ComponentFixture<AssetAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
