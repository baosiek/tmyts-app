import { CurrencyPipe, NgClass, NgStyle, PercentPipe } from '@angular/common';
import { Component, inject, Input, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { PortfolioComponentsDataExchange } from '../../../../../../interfaces/portfolio-components-data-exchange';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { PortfolioPerformanceModel } from '../../../../../../models/portfolio-performance-model';
import { LiveDataService } from '../../../../../../services/live-data/live-data-service';
import { TmytsChip } from '../../../../../reusable-components/tmyts-chip/tmyts-chip';
import { TmytsSnackbar } from '../../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';

@Component({
  selector: 'app-portfolio-performance-table',
  imports: [
    ...MATERIAL_IMPORTS,
    CurrencyPipe,
    PercentPipe,
    TmytsChip,
    NgStyle,
    NgClass,
  ],
  templateUrl: './portfolio-performance-table.html',
  styleUrl: './portfolio-performance-table.scss',
})
export class PortfolioPerformanceTable implements OnChanges {
  @Input() dataExchangeFromParent!: PortfolioComponentsDataExchange;

  liveDataService = inject(LiveDataService);

  displayedColumns: string[] = [
    'symbol',
    'quantity',
    'average_price',
    'actual_price',
    'cash_in',
    'fees',
    'gain_loss',
    'percent',
  ];
  dataSource: MatTableDataSource<PortfolioPerformanceModel> =
    new MatTableDataSource();
  spinnerFlagIsSet: boolean = false;

  constructor(private _snackBar: MatSnackBar) { }

  ngOnChanges(): void {
    if (this.dataExchangeFromParent.symbol_list.length > 0) {
      if (this.dataExchangeFromParent.portfolio_id) {
        const uniqueSimbols = [
          ...new Set(this.dataExchangeFromParent.symbol_list),
        ];
        this.spinnerFlagIsSet = true;
        this.liveDataService
          .getDetailedPortfolioActivity(
            this.dataExchangeFromParent.user_id,
            this.dataExchangeFromParent.portfolio_id,
            uniqueSimbols,
          )
          .subscribe({
            next: (response: PortfolioPerformanceModel[]) => {
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
      }
    } else {
      this.dataSource.data = [];
    }
  }

  getInitialValue() {
    return this.dataSource.data.reduce(
      (acc, value) => acc + value.average_price * value.quantity,
      0,
    );
  }

  getCurrentValue() {
    return this.dataSource.data.reduce(
      (acc, value) => acc + value.actual_price * value.quantity,
      0,
    );
  }

  getTotalGainAnLoss() {
    // console.log(
    //   this.dataSource.data.reduce((acc, value) => acc + value.gain_loss, 0),
    // );
    return this.dataSource.data.reduce(
      (acc, value) => acc + value.gain_loss,
      0,
    );
  }

  getTotalPercent() {
    return this.dataSource.data.reduce(
      (acc, value) => acc + value.weighted_percent,
      0,
    );
  }
}
