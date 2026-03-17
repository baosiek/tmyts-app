import { CurrencyPipe, DecimalPipe, NgClass, NgStyle, PercentPipe } from '@angular/common';
import { Component, inject, input, Input, InputSignal, OnChanges } from '@angular/core';
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
    DecimalPipe,
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

  userId: InputSignal<number> = input.required<number>();
  portfolioName: InputSignal<string | null> = input.required<string | null>();

  displayedColumns: string[] = [
    'asset',
    'quantity',
    'cost_basis_price',
    'close',
    'gain_loss',
    'weighted_percent',
  ];
  dataSource: MatTableDataSource<PortfolioPerformanceModel> =
    new MatTableDataSource();
  spinnerFlagIsSet: boolean = false;

  constructor(private _snackBar: MatSnackBar) { }

  ngOnChanges(): void {
    if (this.dataExchangeFromParent && this.dataExchangeFromParent.portfolio_name) {
      const uniqueAssets = [
        ...new Set(this.dataExchangeFromParent.asset_list),
      ];
      this.spinnerFlagIsSet = true;
      this.liveDataService
        .getPortfolioHoldingsPerformance(
          this.dataExchangeFromParent.user_id,
          this.dataExchangeFromParent.portfolio_name as string,
          uniqueAssets,
        )
        .subscribe({
          next: (response: PortfolioPerformanceModel[]) => {
            // Calculate gain/loss and percent for each item
            const processedData = response.map(item => ({
              ...item,
              gain_loss: (item.close - item.cost_basis_price) * item.quantity,
              weighted_percent: item.cost_basis_price > 0 ? ((item.close - item.cost_basis_price) / item.cost_basis_price) : 0
            }));
            this.dataSource.data = processedData;
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

  getInitialValue() {
    return this.dataSource.data.reduce(
      (acc, value) => acc + value.cost_basis_price * value.quantity,
      0,
    );
  }

  getCurrentValue() {
    return this.dataSource.data.reduce(
      (acc, value) => acc + value.close * value.quantity,
      0,
    );
  }

  getTotalGainAnLoss() {
    return this.dataSource.data.reduce(
      (acc, value) => acc + value.gain_loss,
      0,
    );
  }

  getTotalPercent() {
    if (this.getTotalGainAnLoss() === 0) return 0;
    return this.getTotalGainAnLoss() / this.getInitialValue();
  }
}
