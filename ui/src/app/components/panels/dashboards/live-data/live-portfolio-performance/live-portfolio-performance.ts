import { Component, inject, input, InputSignal, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TmytsPricesHistoryService } from '../../../../../services/tmyts-prices-history/tmyts-prices-history';

@Component({
  selector: 'app-live-portfolio-performance',
  imports: [],
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
    'twr'
  ];

  // inputs userId and portfolio Id to be retriece from this 
  // component's parent
  userId: InputSignal<number> = input.required<number>();
  portfolioId: InputSignal<number | null> = input.required<number | null>();

  //  injects the service to retrive portfolio daily performance
  private tmytsPriceHistoryService = inject(TmytsPricesHistoryService)

  constructor() { }

  ngOnInit(): void {
    console.log(`userId: {${this.userId}}`)
    console.log(`portfolioId: ${this.portfolioId}`)
    this.tmytsPriceHistoryService
      .getPortfolioDailtPerformance(this.userId(), 89, 19406.35)
      .subscribe({
        next: (response) => {
          console.log(`response ===================>: ${JSON.stringify(response)}`)
        },
        error: (error) => {
          // Handle error response
        },
        complete: () => {
          // this.spinnerFlagIsSet = false;
        },
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('portfolioId' in changes) {
      this.tmytsPriceHistoryService
        .getPortfolioDailtPerformance(this.userId(), 89, 19406.35)
        .subscribe({
          next: (response) => {
            console.log(`response ===================>: ${JSON.stringify(response)}`)
          },
          error: (error) => {
            // Handle error response
          },
          complete: () => {
            // this.spinnerFlagIsSet = false;
          },
        });
    }
  }
}
