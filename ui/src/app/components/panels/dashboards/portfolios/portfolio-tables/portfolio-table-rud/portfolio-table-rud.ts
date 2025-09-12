import { Component, input } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { PortfolioLogModel } from '../../../../../../models/portfolio-log-model';
import { CurrencyPipe, DatePipe } from '@angular/common';

const LOG_DATA: PortfolioLogModel[] = [
  {portfolio_id: "Nasdaq tech", symbol_id: "AAPLE", symbol_name: "Apple Inc.", purchase_price: 230.00, quantity: 10, purchase_date: new Date()},
  {portfolio_id: "Nasdaq tech", symbol_id: "GOOG", symbol_name: "Alphaber Inc.", purchase_price: 240.00, quantity: 1, purchase_date: new Date()},
  {portfolio_id: "Nasdaq tech", symbol_id: "NVDA", symbol_name: "Nvidia Inc.", purchase_price: 330.00, quantity: 40, purchase_date: new Date()},
  {portfolio_id: "Nasdaq tech", symbol_id: "AMZN", symbol_name: "Amazon Inc.", purchase_price: 4670.00, quantity: 100, purchase_date: new Date()},
  {portfolio_id: "Nasdaq tech", symbol_id: "META", symbol_name: "Meta Inc.", purchase_price: 338.00, quantity: 7, purchase_date: new Date()},
  {portfolio_id: "Nasdaq tech", symbol_id: "MSFT", symbol_name: "Microsoft Inc.", purchase_price: 21.00, quantity: 171, purchase_date: new Date()},
  {portfolio_id: "Nasdaq tech", symbol_id: "TSLA", symbol_name: "Tesla Inc.", purchase_price: 3.47, quantity: 1000, purchase_date: new Date()},
  {portfolio_id: "Nasdaq tech", symbol_id: "ORCL", symbol_name: "Oracle Inc.", purchase_price: 1771.87, quantity: 0.5, purchase_date: new Date()},
  {portfolio_id: "Nasdaq tech", symbol_id: "AVGO", symbol_name: "Broadcom Inc.", purchase_price: 30.65, quantity: 231, purchase_date: new Date()},
];

@Component({
  selector: 'app-portfolio-table-rud',
  imports: [
    ...MATERIAL_IMPORTS,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './portfolio-table-rud.html',
  styleUrl: './portfolio-table-rud.scss'
})
export class PortfolioTableRud {

  portfolioId = input.required()

  displayedColumns: string[] = ['symbol_id', 'symbol_name', 'purchase_price', 'quantity', 'purchase_date', 'edit', "delete"];
  dataSource = LOG_DATA;

  editRow(element: PortfolioLogModel) {
    console.log(`editing symbol: ${element.symbol_id}`)
  }
  
  deleteRow(element: PortfolioLogModel) {
    console.log(`deliting symbol: ${element.symbol_id}`)
  }
}
