import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsAnalysis } from './assets-analysis';

describe('AssetsAnalysis', () => {
  let component: AssetsAnalysis;
  let fixture: ComponentFixture<AssetsAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
