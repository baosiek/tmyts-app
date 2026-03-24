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
import { PortfolioTransactionModel } from '../../../../../models/portfolio-activity-model';
import { AssetsPriceHistoryService } from '../../../../../services/assets-price-history/assets-price-history-service';
import { IBLivePriceService } from '../../../../../services/ib-services/ib-live-price-service';
import { PortfolioActivityService } from '../../../../../services/portfolio-activity/portfolio-activity-service';
import { TmytsPricesHistoryService } from '../../../../../services/tmyts-prices-history/tmyts-prices-history';
import { TmytsChip } from '../../../../reusable-components/tmyts-chip/tmyts-chip';

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
    'average_price',
    'rt_price',
    'gain_loss',
    'percent',
    'adj_price_close',
    'last_gain_loss',
    'last_percent',
  ];

  private streamService = inject(IBLivePriceService);
  private assetsPriceHistoryService = inject(AssetsPriceHistoryService);
  private tmytsService = inject(TmytsPricesHistoryService)
  private subscription?: Subscription;

  portfolioTransactionService = inject(PortfolioActivityService);

  userId: InputSignal<number> = input.required<number>();
  portfolioName: InputSignal<string> = input.required<string>();

  dataSource: MatTableDataSource<LivePortfolioPerformanceInterface> =
    new MatTableDataSource();

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.getPortfolioTransactions();
  }

  getPortfolioTransactions() {
    if (this.portfolioName()) {
      this.portfolioTransactionService.getTransactionsForPortfolio(this.userId(), this.portfolioName())
        .subscribe(
          {
            next: (response: PortfolioTransactionModel[]) => {
              this.dataSource.data = response.map(item => ({
                asset: item.asset,
                asset_name: item.asset_name,
                total_quantity: item.total_quantity,
                average_price: item.average_price,
                rt_price: 0,
                gain_loss: 0,
                percent: 0,
                adj_price_close: 0,
                total_cash_in: 0,
                total_cash_out: 0,
                total_fees: 0,
                total_value: 0,
                portfolio_value: 0,
                last_gain_loss: 0,
                last_percent: 0
              }));

              response.forEach((item) => {
                this.streamService.closeConnection(item.asset);
                this.registerToIBLivePrice(item.asset);
              });
            },
            error: (error) => { },
            complete: () => {
              this.getAssetsLatestPrices();
            }
          }
        )
    }
  }

  getAssetsLatestPrices() {
    this.assetsPriceHistoryService.getAssetsLatestPrices(this.dataSource.data.map(item => item.asset))
      .subscribe(
        {
          next: (response) => {
            response.forEach((item) => {
              this.dataSource.data.forEach((element) => {
                if (element.asset === item.asset) {
                  element.adj_price_close = item.adj_price_close;
                }
              });
            });
          },
          error: (error) => {
            console.log(`error: ${JSON.stringify(error)}`)
          },
          complete: () => { }
        }
      )
  }

  registerToIBLivePrice(symbol: string) {
    // Subscribe to the specific stream for THIS asset
    this.subscription = this.streamService.getPriceStream(this.portfolioName(), symbol).subscribe({
      next: (message) => {
        // The API message structure is {"symbol": "...", "price": ...}
        this.dataSource.data.forEach((item) => {
          if (item.asset === symbol) {
            if (message.type === 'tick') {
              item.rt_price = message.last_price;
              item.gain_loss = (item.rt_price - item.average_price) * item.total_quantity;
              item.percent = (item.gain_loss / (item.average_price * Math.abs(item.total_quantity)));
              item.last_gain_loss = (item.rt_price - item.adj_price_close) * item.total_quantity;
              item.last_percent = (item.last_gain_loss / (item.adj_price_close * Math.abs(item.total_quantity)));
            }
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
