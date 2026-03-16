import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, input, InputSignal, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { PortfolioHoldingsModel } from '../../../../../../models/portfolio_holdings_model';
import { TmytsHoldingsService } from '../../../../../../services/tmyts-holdings/tmyts-holdings-service';
import { TmytsSnackbar } from '../../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';

@Component({
  selector: 'app-portfolio-holdings-table',
  imports: [...MATERIAL_IMPORTS, MatSortModule, DatePipe, CurrencyPipe, DecimalPipe],
  templateUrl: './portfolio-holdings-table.html',
  styleUrl: './portfolio-holdings-table.scss'
})
export class PortfolioHoldingsTable implements OnInit, OnChanges {


  spinnerFlagIsSet: boolean = false;

  userId: InputSignal<number> = input.required<number>();
  portfolioName: InputSignal<string | null> = input.required<string | null>();

  portfolioHoldingsService: TmytsHoldingsService = inject(TmytsHoldingsService);


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
  ];

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log(`ONINIT this.dataExchangeFromParent: userId: ${this.userId} | portfolioName: ${this.portfolioName}`)
  }

  ngOnChanges(): void {
    console.log(`ONINIT this.dataExchangeFromParent: userId: ${this.userId} | portfolioName: ${this.portfolioName}`)
    if (this.userId() && this.portfolioName()) {
      this.spinnerFlagIsSet = true;
      this.portfolioHoldingsService
        .getHoldings(
          this.userId(),
          this.portfolioName() as string,
        )
        .subscribe({
          next: (response: PortfolioHoldingsModel[]) => {
            console.log(`Response: ${JSON.stringify(response)}`)
            this.dataSource.data = response;
          },
          error: (error) => {
            // Handle error response
            const message: string = `Error: ${JSON.stringify(error.error.detail)}`;

            // Renders error snack-bar
            this._snackBar.openFromComponent(TmytsSnackbar, {
              data: { message: message, action: 'Close' },
              panelClass: ['error-snackbar-theme'],
            });
          },
          complete: () => {
            this.spinnerFlagIsSet = false;
          },
        });
    } else {
      this.dataSource.data = [];
    }
  }
}
