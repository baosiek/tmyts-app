import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { LivePerformanceInterface } from '../../../../../interfaces/live-performance-interface';
import { PortfolioActivityModel } from '../../../../../models/portfolio-activity-model';
import { IBLivePriceService } from '../../../../../services/ib-services/ib-live-price-service';
import { PortfolioActivityService } from '../../../../../services/portfolio-activity/portfolio-activity-service';
import { TmytsChip } from '../../../../reusable-components/tmyts-chip/tmyts-chip';
import { TmytsSnackbar } from '../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';

@Component({
  selector: 'app-live-portfolio-performance',
  imports: [MatTableModule, CommonModule, TmytsChip],
  templateUrl: './live-portfolio-performance.html',
  styleUrl: './live-portfolio-performance.scss',
})
export class LivePortfolioPerformance implements OnInit, OnDestroy {
  displayedColumns: string[] = ['symbol', 'gain_loss', 'percent'];
  private destroyRef = inject(DestroyRef);
  private streamService = inject(IBLivePriceService);
  private subscription?: Subscription;

  portfolioActivityService = inject(PortfolioActivityService);

  userId: InputSignal<number> = input.required<number>();
  portfolioId: InputSignal<number | null> = input.required<number | null>();

  // Pattern 1: Dictionary-like State
  // Using a Record allows O(1) lookups/updates by a unique key (symbol)
  private performanceMap = signal<Record<string, LivePerformanceInterface>>({});

  // Pattern 2: Derived DataSource
  // 'computed' ensures the table data refreshes only when the dictionary changes
  dataSource = computed(() => {
    const dataArray = Object.values(this.performanceMap());
    return new MatTableDataSource<LivePerformanceInterface>(dataArray);
  });

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void { }

  ngOnChanges(): void {
    this.getPortfolioActivityContent(this.portfolioId());
  }

  getPortfolioActivityContent(portfolioId: number | null) {
    if (portfolioId) {
      // this.spinnerFlagIsSet = true;
      this.portfolioActivityService
        .getActivityForPortfolio(this.userId(), portfolioId)
        .subscribe({
          next: (response: PortfolioActivityModel[]) => {
            // updates datasource
            // this.dataSource.data = response

            // builds list of symbols to send to performance table component
            const symbols: string[] = [];
            response.forEach((item) => {
              console.log(`${item.symbol} ${item.purchase_price}`);
              symbols.push(item.symbol);
            });
            symbols.forEach((symbol) => {
              this.registerToIBLivePrice(symbol);
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
    // Subscribe to the specific stream for THIS symbol
    this.subscription = this.streamService.getPriceStream(symbol).subscribe({
      next: (message) => {
        // The API message structure is {"symbol": "...", "price": ...}
        if (message.symbol === symbol) {
          console.log(`Symbol: ${symbol}, Price: ${message.price}}`);
        }
      },
      error: (err) => console.error(`Error with ${symbol} stream:`, err),
    });
  }

  ngOnDestroy() {
    // Ensure all connections are terminated when the dashboard is removed
    console.log('destroying live data component');
    this.streamService.closeAllConnections();
  }
}
