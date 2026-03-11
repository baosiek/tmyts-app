import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { LivePortfolioPerformanceInterface } from '../../../../../interfaces/portfolio-performance-interface';
import { PortfolioActivityModel } from '../../../../../models/portfolio-activity-model';
import { IBLivePriceService } from '../../../../../services/ib-services/ib-live-price-service';
import { PortfolioActivityService } from '../../../../../services/portfolio-activity/portfolio-activity-service';
import { TmytsPricesHistoryService } from '../../../../../services/tmyts-prices-history/tmyts-prices-history';
import { TmytsChip } from '../../../../reusable-components/tmyts-chip/tmyts-chip';
import { TmytsSnackbar } from '../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';

@Component({
  selector: 'app-live-asset-performance',
  imports: [MatTableModule, CommonModule, TmytsChip],
  templateUrl: './live-asset-performance.html',
  styleUrl: './live-asset-performance.scss',
})
export class LiveAssetPerformance implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'asset',
    'asset_name',
    'total_quantity',
    'weighted_average_purchase_price',
    'rt_price',
    'gain_loss',
    'percent',
    'adj_price_close',
    'last_gain_loss',
    'last_percent',
  ];

  private streamService = inject(IBLivePriceService);
  private tmytsService = inject(TmytsPricesHistoryService)
  private subscription?: Subscription;

  portfolioActivityService = inject(PortfolioActivityService);

  userId: InputSignal<number> = input.required<number>();
  portfolioName: InputSignal<string | null> = input.required<string | null>();

  dataSource: MatTableDataSource<LivePortfolioPerformanceInterface> =
    new MatTableDataSource();

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.getPortfolioActivityContent(this.portfolioName());

  }

  getPortfolioActivityContent(portfolioName: string | null) {
    if (portfolioName) {
      // this.spinnerFlagIsSet = true;
      this.portfolioActivityService
        .getActivityForPortfolio(this.userId(), portfolioName)
        .subscribe({
          next: (response: PortfolioActivityModel[]) => {
            console.log(`responsekkkkkkkkkkkkkkkkk: ${JSON.stringify(response)}`)

            // builds list of assets to send to performance table component
            const symbols: string[] = [];
            response.forEach((item) => {
              symbols.push(item.asset);
            });

            symbols.forEach((symbol) => {
              console.log(`symbol: ${symbol}`)
              this.streamService.closeConnection(symbol);
              this.registerToIBLivePrice(symbol);
            });
            this.tmytsService
              .getPortfolioPerformance(this.userId(), portfolioName as string, symbols)
              .subscribe({
                next: (response) => {
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
                  // this.spinnerFlagIsSet = false;
                },
              });
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
            // this.spinnerFlagIsSet = false;
          },
        });
    }
  }

  registerToIBLivePrice(symbol: string) {
    // Subscribe to the specific stream for THIS asset
    this.subscription = this.streamService.getPriceStream(symbol).subscribe({
      next: (message) => {
        // The API message structure is {"symbol": "...", "price": ...}
        this.dataSource.data.forEach((item) => {
          if (item.asset === symbol) {
            item.rt_price = message.price;
            item.gain_loss = item.rt_price - item.weighted_average_purchase_price;
            item.percent = (item.gain_loss / item.weighted_average_purchase_price);
            item.last_gain_loss = item.rt_price - item.adj_price_close;
            item.last_percent = (item.last_gain_loss / item.adj_price_close);
          }
        });
        this.dataSource._updateChangeSubscription()
      },
      error: (err) => console.error(`Error with ${symbol} stream:`, err),
    });
  }

  ngOnDestroy() {
    // Ensure all connections are terminated when the dashboard is removed
    this.streamService.closeAllConnections();
  }
}
