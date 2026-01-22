import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LivePerformanceInterface } from '../../../../../interfaces/live-performance-interface';
import { PortfolioPerformanceModel } from '../../../../../models/portfolio-performance-model';
import { MockLivePerformanceDataService } from '../../../../../services/yf_live/mock-live-data';
import { TmytsChip } from '../../../../reusable-components/tmyts-chip/tmyts-chip';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PortfolioPerformanceModel[] = [
  {
    symbol: 'AAPL',
    symbol_name: 'Apple Inc.',
    quantity: 1.0079,
    average_price: 10,
    actual_price: 20,
    gain_loss: 5,
    weighted_percent: 0.5,
    percent: 0.4,
  },
  {
    symbol: 'GOOG',
    symbol_name: 'Google Inc.',
    quantity: 1.0079,
    average_price: 10,
    actual_price: 20,
    gain_loss: -5,
    weighted_percent: 0.5,
    percent: -0.4,
  },
  {
    symbol: 'TSLA',
    symbol_name: 'Tesla Inc.',
    quantity: 1.0079,
    average_price: 10,
    actual_price: 20,
    gain_loss: 5,
    weighted_percent: 0.5,
    percent: 0.4,
  },
  {
    symbol: 'MSFT',
    symbol_name: 'Microsoft Inc.',
    quantity: 1.0079,
    average_price: 10,
    actual_price: 20,
    gain_loss: 5,
    weighted_percent: 0.5,
    percent: 0.4,
  },
  {
    symbol: 'META',
    symbol_name: 'Meta Inc.',
    quantity: 1.0079,
    average_price: 10,
    actual_price: 20,
    gain_loss: 5,
    weighted_percent: 0.5,
    percent: 0.4,
  },
  {
    symbol: 'NVDA',
    symbol_name: 'Nvidia Inc.',
    quantity: 1.0079,
    average_price: 10,
    actual_price: 20,
    gain_loss: 5,
    weighted_percent: 0.5,
    percent: 0.4,
  },
  {
    symbol: 'AMZN',
    symbol_name: 'Amazon Inc.',
    quantity: 1.0079,
    average_price: 10,
    actual_price: 20,
    gain_loss: 5,
    weighted_percent: 0.5,
    percent: 0.4,
  },
];

@Component({
  selector: 'app-week-performance',
  imports: [MatTableModule, CommonModule, TmytsChip],
  templateUrl: './week-performance.html',
  styleUrl: './week-performance.scss',
})
export class WeekPerformance implements OnInit {
  displayedColumns: string[] = ['symbol', 'gain_loss', 'percent'];
  private destroyRef = inject(DestroyRef);
  // private streamService = inject(LivePerformanceDataService);
  private streamService = inject(MockLivePerformanceDataService);

  // Pattern 1: Dictionary-like State
  // Using a Record allows O(1) lookups/updates by a unique key (symbol)
  private performanceMap = signal<Record<string, LivePerformanceInterface>>({});

  // Pattern 2: Derived DataSource
  // 'computed' ensures the table data refreshes only when the dictionary changes
  dataSource = computed(() => {
    const dataArray = Object.values(this.performanceMap());
    return new MatTableDataSource<LivePerformanceInterface>(dataArray);
  });

  ngOnInit(): void {
    this.startStreaming();
  }

  startStreaming() {
    this.streamService
      .getStream('http://localhost:8000/yf_live/live-data/')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: LivePerformanceInterface) => {
          // Dictionary Update Strategy:
          // If the symbol exists, it updates; if not, it inserts.
          this.performanceMap.update((current) => ({
            ...current,
            [data.symbol]: data,
          }));
          console.log('Update received for:', data.symbol);
        },
        error: (err) => console.error('Streaming error:', err),
      });
  }
}
