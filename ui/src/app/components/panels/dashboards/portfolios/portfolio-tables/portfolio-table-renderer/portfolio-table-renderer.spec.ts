import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioTableRenderer } from './portfolio-table-renderer';

describe('PortfolioTableRenderer', () => {
  let component: PortfolioTableRenderer;
  let fixture: ComponentFixture<PortfolioTableRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioTableRenderer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioTableRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
