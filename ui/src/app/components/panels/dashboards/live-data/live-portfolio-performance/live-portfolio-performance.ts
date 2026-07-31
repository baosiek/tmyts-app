import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PortfolioCashflowInterface } from '../../../../../interfaces/cashflow-performance-interface';
import { PortfolioPerformanceService } from '../../../../../services/portfolios/portfolio-performance-service';
import { LoggingService } from '../../../../../services/logging/logging-service';


@Component({
  selector: 'app-live-portfolio-performance',
  imports: [MatTableModule, CommonModule],
  templateUrl: './live-portfolio-performance.html',
  styleUrl: './live-portfolio-performance.scss'
})
export class LivePortfolioPerformance implements OnChanges {

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
  private logging = inject(LoggingService)

  // intializes the datasource that contains the portfolio's
  // cash flow data
  dataSource: MatTableDataSource<PortfolioCashflowInterface> =
    new MatTableDataSource();

  constructor() { }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.portfolioName()) {
      this.portfolioPerformanceService.getPortfolioTwr(this.portfolioName())
        .subscribe({
          next: (response: PortfolioCashflowInterface[]) => {
            this.dataSource.data = response;
          },
          error: (error) => {
            this.logging.logError(error, { component: 'LivePortfolioPerformance', method: 'getPortfolioTwr' });
          },
          complete: () => {
            // this.spinnerFlagIsSet = false;
          },
        });
    }
  }
}
