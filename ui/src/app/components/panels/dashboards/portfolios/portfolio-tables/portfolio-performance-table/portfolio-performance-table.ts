import { Component, inject, Input, OnChanges } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { PortfolioPerformanceInterface } from '../../../../../../interfaces/portfolio-performance-interface';
import { PortfolioComponentsDataExchange } from '../../../../../../interfaces/portfolio-components-data-exchange';
import { LiveDataService } from '../../../../../../services/live-data/live-data-service';
import { catchError } from 'rxjs';
import { PortfolioPerformanceModel } from '../../../../../../models/portfolio-performance-model';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyPipe, NgClass, NgStyle, PercentPipe } from '@angular/common';
import { TmytsChip } from '../../../../../sub-components/tmyts-chip/tmyts-chip';


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
    PercentPipe,
    TmytsChip,
    NgStyle,
    NgClass
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
    
    if (this.dataExchangeFromParent.symbol_list.length > 0) {
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
          console.log()
          this.dataSource.data = response;      
        }
      );
    } else {
      this.dataSource.data = []
    }   
  }

  getAmountTotals(): number[] {

    let acc_actual: number = 0;
    let acc_average: number = 0;

    const response: number[] = []
    this.dataSource.data.forEach(
      (d) => {
        acc_actual += (d.actual_price * d.quantity)
        acc_average += (d.average_price * d.quantity)
      }
    )
    response.push(acc_actual);
    response.push(acc_average)

    return response;
  }

  getAmountVariation(): number[] {

    let variation: number = 0;
    let percent: number = 0;
    const response: number[] = []

    const totals: number[] = this.getAmountTotals()
    variation = totals[0] - totals[1]
    percent = variation / totals[1]

    response.push(variation);
    response.push(percent)

    return response;
  }

  getStatusColor(value: number): string {
    console.log("Value: ", value)
    if (value >= 0) {
      return '#2b5c33';
    } else {
      return '#fc030b';
    }
  }

  getTotalInvested() {
      return this.dataSource.data.reduce((acc, value) => acc + (value.average_price * value.quantity), 0);
  }

  getTotalBalance() {
      return this.dataSource.data.reduce((acc, value) => acc + (value.actual_price * value.quantity), 0);
  }

  getTotalVariation() {
      const invested = this.getTotalInvested();
      const balance = this.getTotalBalance();
      return balance - invested;
  }

  getTotalPercent() {
      const invested = this.getTotalInvested();
      const balance = this.getTotalBalance();
      return (balance - invested) / invested;
  }
}
