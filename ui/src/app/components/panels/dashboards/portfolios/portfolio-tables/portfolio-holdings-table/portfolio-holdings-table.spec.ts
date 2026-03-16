import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioHoldingsTable } from './portfolio-holdings-table';

describe('PortfolioHoldingsTable', () => {
  let component: PortfolioHoldingsTable;
  let fixture: ComponentFixture<PortfolioHoldingsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioHoldingsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioHoldingsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
