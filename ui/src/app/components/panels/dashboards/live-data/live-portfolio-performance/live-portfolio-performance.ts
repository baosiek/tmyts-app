import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PortfolioCashflowInterface } from '../../../../../interfaces/cashflow-performance-interface';
import { PortfolioPerformanceService } from '../../../../../services/portfolios/portfolio-performance-service';


@Component({
  selector: 'app-live-portfolio-performance',
  imports: [MatTableModule, CommonModule],
  templateUrl: './live-portfolio-performance.html',
  styleUrl: './live-portfolio-performance.scss'
})
export class LivePortfolioPerformance implements OnChanges, OnInit {

  // defines the columns to be rendered
  displayedColumns: string[] = [
    'price_date',
    'market_value',
    'cash_flow',
    'daily_return_pct',
    'cumulative_twr_pct',
  ];

  // inputs userId and portfolio Id to be retriece from this 
  // component's parent
  userId: InputSignal<number> = input.required<number>();
  portfolioName: InputSignal<string> = input.required<string>();

  // the initial amount invested
  initialAmount: number = 19406.35;

  // injects the service to retrive portfolio daily performance
  private portfolioPerformanceService = inject(PortfolioPerformanceService)

  // intializes the datasource that contains the portfolio's
  // cash flow data
  dataSource: MatTableDataSource<PortfolioCashflowInterface> =
    new MatTableDataSource();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.portfolioName()) {
      this.portfolioPerformanceService.getPortfolioTwr(this.portfolioName())
        .subscribe({
          next: (response: PortfolioCashflowInterface[]) => {
            console.log(`response: ${response}`);
            this.dataSource.data = response;
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            // this.spinnerFlagIsSet = false;
          },
        });
    }
  }
}
