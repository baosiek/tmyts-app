import { Component, inject, Input, OnChanges } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { PortfolioPerformanceInterface } from '../../../../../../interfaces/portfolio-performance-interface';
import { PortfolioComponentsDataExchange } from '../../../../../../interfaces/portfolio-components-data-exchange';
import { LiveDataService } from '../../../../../../services/live-data/live-data-service';
import { catchError } from 'rxjs';
import { PortfolioPerformanceModel } from '../../../../../../models/portfolio-performance-model';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyPipe, PercentPipe } from '@angular/common';


const ELEMENT_DATA: PortfolioPerformanceInterface[] = [
  {symbol_id: "AAPL", symbol_name: "Apple Inc.", price: 231.00, variation: 0.010, percent: 1.76},
  {symbol_id: "GOOG", symbol_name: "Alphabet Inc.", price: 231.00, variation: 0.010, percent: 1.76},
  {symbol_id: "NVDA", symbol_name: "Nvidia Inc.", price: 231.00, variation: 0.010, percent: 1.76},
  {symbol_id: "AMZN", symbol_name: "Amazon Inc.", price: 231.00, variation: 0.010, percent: 1.76},
  {symbol_id: "META", symbol_name: "Meta Inc.", price: 231.00, variation: 0.010, percent: 1.76},
  {symbol_id: "MFST", symbol_name: "Microsoft Inc.", price: 231.00, variation: 0.010, percent: 1.76},
  {symbol_id: "TSLA", symbol_name: "Tesla Inc.", price: 231.00, variation: 0.010, percent: 1.76},
  {symbol_id: "ORCL", symbol_name: "Oracle Inc.", price: 231.00, variation: 0.010, percent: 1.76},
  {symbol_id: "AVGO", symbol_name: "Broadcom Inc.", price: 231.00, variation: 0.010, percent: 1.76},
];

@Component({
  selector: 'app-portfolio-performance-table',
  imports: [
    ...MATERIAL_IMPORTS,
    CurrencyPipe,
    PercentPipe
  ],
  templateUrl: './portfolio-performance-table.html',
  styleUrl: './portfolio-performance-table.scss'
})
export class PortfolioPerformanceTable implements OnChanges{

  @Input() dataExchangeFromParent!: PortfolioComponentsDataExchange;

  liveDataService = inject(LiveDataService)

  displayedColumns: string[] = ['symbol', 'quantity', 'average_price', 'actual_price', 'variation', 'percent'];
  dataSource: MatTableDataSource<PortfolioPerformanceModel> = new MatTableDataSource();

  ngOnChanges(): void {
    if (this.dataExchangeFromParent.user_id !== 0) {
      this.liveDataService.getDetailedPortfolioActivity(
      this.dataExchangeFromParent.user_id,
      this.dataExchangeFromParent.portfolio_id,
      this.dataExchangeFromParent.symbol_list
    )
    .pipe(
      catchError(
        (error) => {
          console.log(error);
          throw error;
        }
      )
    )
    .subscribe(
      (response) => {
        this.dataSource.data = response;      
      }
    );
    }
    
  }

}
