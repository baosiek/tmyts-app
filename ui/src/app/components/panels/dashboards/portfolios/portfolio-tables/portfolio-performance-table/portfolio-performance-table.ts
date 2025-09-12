import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { PortfolioPerformanceInterface } from '../../../../../../interfaces/portfolio-performance-interface';


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
    ...MATERIAL_IMPORTS
  ],
  templateUrl: './portfolio-performance-table.html',
  styleUrl: './portfolio-performance-table.scss'
})
export class PortfolioPerformanceTable {
  displayedColumns: string[] = ['symbol_id', 'symbol_name', 'price', 'variation', 'percent'];
  dataSource = ELEMENT_DATA;
}
