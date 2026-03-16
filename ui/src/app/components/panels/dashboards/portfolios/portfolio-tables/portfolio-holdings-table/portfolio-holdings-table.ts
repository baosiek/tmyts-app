import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { PortfolioHoldingsModel } from '../../../../../../models/portfolio_holdings_model';

@Component({
  selector: 'app-portfolio-holdings-table',
  imports: [...MATERIAL_IMPORTS, MatSortModule, DatePipe, CurrencyPipe],
  templateUrl: './portfolio-holdings-table.html',
  styleUrl: './portfolio-holdings-table.scss'
})
export class PortfolioHoldingsTable {

  spinnerFlagIsSet: boolean = false;

  dataSource: MatTableDataSource<PortfolioHoldingsModel> =
    new MatTableDataSource();

  displayedColumns: string[] = [
    'price_date',
    'asset',
    'asset_name',
    'weight',
    'quantity',
    'cost_basis_price',
    'total_cost_basis',

    // 'purchase_date',
    // 'fees',
    // 'cash_in',
    // 'broker_name',
    // 'delete',
  ];
}
