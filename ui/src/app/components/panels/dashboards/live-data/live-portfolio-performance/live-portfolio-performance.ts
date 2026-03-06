import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PortfolioCashflowInterface } from '../../../../../interfaces/cashflow-performance-interface';
import { TmytsPricesHistoryService } from '../../../../../services/tmyts-prices-history/tmyts-prices-history';


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
    'cash',
    'market_value',
    'nav',
    'daily_return',
    'cumulative_return'
  ];

  // inputs userId and portfolio Id to be retriece from this 
  // component's parent
  userId: InputSignal<number> = input.required<number>();
  portfolioId: InputSignal<number | null> = input.required<number | null>();

  // the initial amount invested
  initialAmount: number = 19406.35;


  // injects the service to retrive portfolio daily performance
  private tmytsPriceHistoryService = inject(TmytsPricesHistoryService)

  // intializes the datasource that contains the portfolio's
  // cash flow data
  dataSource: MatTableDataSource<PortfolioCashflowInterface> =
    new MatTableDataSource();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('portfolioId' in changes) {
      console.log(this.portfolioId());
      console.log(this.userId());
      this.tmytsPriceHistoryService
        .getPortfolioDailtPerformance(this.userId(), this.portfolioId(), 19406.35)
        .subscribe({
          next: (response: PortfolioCashflowInterface[]) => {
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
