import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PortfolioTransactionModel } from '../../../../../models/portfolio-activity-model';
import { PortfolioHoldingsModel } from '../../../../../models/portfolio_holdings_model';
import { AssetsPriceHistoryService } from '../../../../../services/assets-price-history/assets-price-history-service';
import { IBLivePriceService } from '../../../../../services/ib-services/ib-live-price-service';
import { OhlcvData } from '../../../../../services/ohlcv-data/ohlcv-data';
import { PortfolioActivityService } from '../../../../../services/portfolio-activity/portfolio-activity-service';
import { TmytsHoldingsService } from '../../../../../services/tmyts-holdings/tmyts-holdings-service';
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
  private portfolioTransactionService = inject(PortfolioActivityService);
  private portfolioHoldingsService = inject(TmytsHoldingsService);
  private ohlcvService = inject(OhlcvData);

  private destroy$ = new Subject<void>();
  private assetMap = new Map<string, any>();

  userId: InputSignal<number> = input.required<number>();
  portfolioName: InputSignal<string> = input.required<string>();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor() { }

  ngOnInit(): void {
    this.getPortfolioTransactions();
  }

  ngOnChanges(): void {
    this.getPortfolioTransactions();
  }

  private calculatePerformanceMetrics(element: any, closePrice: number, adjPriceClose?: number): void {
    element.rt_price = closePrice;
    element.gain_loss = (element.rt_price - element.average_price) * element.total_quantity;
    element.percent = this.safePercent(element.gain_loss, element.average_price * Math.abs(element.total_quantity));

    if (adjPriceClose !== undefined) {
      element.last_gain_loss = (closePrice - adjPriceClose) * element.total_quantity;
      element.last_percent = this.safePercent(element.last_gain_loss, adjPriceClose * Math.abs(element.total_quantity));
    }
  }

  private safePercent(numerator: number, denominator: number): number {
    return denominator !== 0 ? numerator / denominator : 0;
  }

  private getPortfolioHoldings(): void {
    if (!this.userId() || !this.portfolioName()) {
      this.dataSource.data = [];
      return;
    }

    this.portfolioHoldingsService
      .getHoldings(this.userId(), this.portfolioName() as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PortfolioHoldingsModel[]) => {
          const assets = response.map(item => item.asset);

          this.ohlcvService.getOhlcvData(assets)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (ohlcvData) => {
                ohlcvData.forEach((item) => {
                  if (item.asset) {
                    const element = this.assetMap.get(item.asset);
                    if (element) {
                      this.calculatePerformanceMetrics(element, item.close_price, element.adj_price_close);
                      this.dataSource._updateChangeSubscription();
                    }
                  }
                });
              },
              error: (error: any) => {
                console.error('Error fetching OHLCV data:', error);
              }
            });
        },
        error: (error: any) => {
          console.error('Error fetching portfolio holdings:', error);
        }
      });
  }

  private getPortfolioTransactions(): void {
    if (!this.portfolioName()) {
      return;
    }

    this.portfolioTransactionService
      .getTransactionsForPortfolio(this.userId(), this.portfolioName())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

          // Build asset map for O(1) lookups
          this.assetMap.clear();
          this.dataSource.data.forEach(item => {
            this.assetMap.set(item.asset, item);
            this.streamService.closeConnection(item.asset);
            this.registerToIBLivePrice(item.asset);
          });

          this.getAssetsLatestPrices();
        },
        error: (error: any) => {
          console.error('Error fetching portfolio transactions:', error);
        }
      });
  }

  private getAssetsLatestPrices(): void {
    const assetList = this.dataSource.data.map(item => item.asset);

    this.assetsPriceHistoryService
      .getAssetsLatestPrices(assetList)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          response.forEach((item) => {
            const element = this.assetMap.get(item.asset);
            if (element) {
              element.adj_price_close = item.adj_price_close;
            }
          });
          this.getPortfolioHoldings();
        },
        error: (error: any) => {
          console.error('Error fetching latest prices:', error);
        }
      });
  }

  private registerToIBLivePrice(symbol: string): void {
    this.streamService
      .getPriceStream(this.portfolioName(), symbol)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          if (message.type === 'tick') {
            const element = this.assetMap.get(symbol);
            if (element) {
              this.calculatePerformanceMetrics(element, message.last_price, element.adj_price_close);
              this.dataSource._updateChangeSubscription();
            }
          }
        },
        error: (err) => console.error(`Error with ${symbol} stream:`, err)
      });
  }

  ngOnDestroy(): void {
    this.streamService.closeAllConnections();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
