import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioTableRud } from './portfolio-table-rud';

describe('PortfolioTableRud', () => {
  let component: PortfolioTableRud;
  let fixture: ComponentFixture<PortfolioTableRud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioTableRud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioTableRud);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
