import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from "@angular/material/divider";
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar } from "@angular/material/progress-bar";
import { ChartConstructorType, HighchartsChartComponent, providePartialHighcharts } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock'; // Import Highcharts
import { catchError, interval, of, startWith, switchMap } from 'rxjs'; // Import catchError and of
import { OhlcvDataInterface } from '../../../../../interfaces/ohlcv-interface';
import { PortfolioHoldingsModel } from '../../../../../models/portfolio_holdings_model';
import { ALLModel, IndicatorTaService } from '../../../../../services/indicator-ta/indicator-ta-service';
import { OhlcvData } from '../../../../../services/ohlcv-data/ohlcv-data';
import { ThemeService } from '../../../../../services/theme-service/theme-service';


@Component({
  selector: 'app-asset-card',
  imports: [MatCardModule, HighchartsChartComponent, CurrencyPipe, MatProgressBar, MatDivider, MatButtonModule, MatIconModule],
  templateUrl: './asset-card.html',
  styleUrl: './asset-card.scss',
  providers: [
    providePartialHighcharts(  // importing this module is crutial to enable stockChart
      { modules: () => [import('highcharts/esm/modules/stock'), import('highcharts/esm/highcharts-more')] },
    ),
  ]
})
export class AssetCard {

  /**
   * 1. Class variables
   */
  // Bound normally (`[asset]="..."`) when rendered in the live-tracker grid.
  // Left unset when this component is instead opened as fullscreen dialog
  // content (see toggleFullscreen()), where `dialogAsset` supplies it instead.
  readonly assetInput = input<PortfolioHoldingsModel>(undefined, { alias: 'asset' });
  private readonly dialogAsset = inject<PortfolioHoldingsModel | null>(MAT_DIALOG_DATA, { optional: true });
  readonly asset = computed(() => this.dialogAsset ?? this.assetInput()!);

  private readonly dialog = inject(MatDialog);
  // Only set when THIS instance is the one running inside the fullscreen
  // dialog (as opposed to the original instance still sitting in the grid).
  private readonly dialogRef = inject(MatDialogRef<AssetCard>, { optional: true });
  readonly isDialogInstance = !!this.dialogRef;

  Highcharts: typeof Highcharts = Highcharts; // Highcharts library boilerplate code
  chartConstructor: ChartConstructorType = 'stockChart'; // Chart constructor type
  chart?: Highcharts.StockChart;

  groupingUnits: [string, number[] | null][] = [
    ['minute', [1, 5, 10, 15, 20, 30]],
    // ['hour', [1, 2, 3, 4, 6]],
  ];

  // Width of the live-following window, matching the "4h" rangeSelector button
  // (buttons[4] below). Passing xAxis.min/max through chartOptions/chart.update()
  // does NOT work here: axis.userMin/userMax (set once by rangeSelector.selected
  // at chart creation) win over axis.options.min/max on every subsequent update,
  // and chart.update() never re-triggers the rangeSelector click to refresh them
  // (its own diffing drops unchanged rangeSelector options, and clickButton()
  // caps its new max at the axis's current, stale max anyway). So the window is
  // instead re-anchored directly via axis.setExtremes() from the 'redraw' event,
  // see onChartInstance()/followLiveWindow() below.
  private readonly visibleRangeMs = 4 * 60 * 60 * 1000;
  private lastFollowedDataMax?: number;


  /**
   * componentColor/textColor track the chart's background and text colors
   * from the current Material theme (see the constructor's effect below,
   * which re-derives them whenever ThemeService.isDark() toggles - Highcharts
   * renders to its own <svg>, so it never picks up CSS variable changes on
   * its own the way the rest of the app's DOM does).
   */
  componentColor = signal<string>('#ffffff');
  textColor = signal<string>('#000000');

  /**
   * Define chart options as a signal
   */
  chartOptions = signal<Highcharts.Options>({
    title: { text: 'Live OHLCV Data' },
    time: {
      timezone: 'America/New_York'
    },
    rangeSelector: {
      enabled: true,
      selected: 4,
      buttons: [
        {
          type: 'minute',
          count: 15,
          text: '15m'
        },
        {
          type: 'minute',
          count: 30,
          text: '30m'
        },
        {
          type: 'hour',
          count: 1,
          text: '1h'
        },
        {
          type: 'hour',
          count: 2,
          text: '2h'
        },
        {
          type: 'hour',
          count: 4,
          text: '4h'
        },
        {
          type: 'hour',
          count: 8,
          text: '8h'
        },
        {
          type: 'day',
          count: 1,
          text: '1d'
        },
        {
          type: 'all',
          text: 'All',
          title: 'View all'
        }
      ]
    },
    accessibility: {
      enabled: false,
    },
    navigator: {
      // Must stay true (Highcharts default) for a live-polling chart: it wires the
      // 'updatedData' listener that extends the navigator/base X axis as new bars
      // arrive. false is only correct for the lazy-loading-old-data-on-pan pattern.
      adaptToUpdatedData: true,
      enabled: true,
      series: {
        color: '#fc6603',
      },

    },
    chart: {
      backgroundColor: this.componentColor(),
      styledMode: false,
      height: null
    },
    legend: { enabled: true },
    credits: { enabled: false },
    tooltip: {
      enabled: true,
      split: true, // Best for multi-pane financial charts
      shared: false
    },
    plotOptions: {
      candlestick: {
        color: 'pink',
        lineColor: 'red',
        upColor: 'green',
        upLineColor: 'darkgreen',
      },
      column: {
        color: 'blue',
        tooltip: {
          valueDecimals: 2,
          position: {
            align: 'right',
            relativeTo: 'chart',
            verticalAlign: 'bottom'

          }
        }
      },
    },
    series: [
      {
        type: 'candlestick',
        name: 'Stock Prices', // Standardized name
        showInLegend: true,
        dataGrouping: {
          units: this.groupingUnits,
          approximation: 'ohlc',
        },
      },
      {
        type: 'column',
        name: 'Volume',
        showInLegend: true,
        yAxis: 1,
        dataGrouping: {
          approximation: 'sum',
          units: this.groupingUnits,
        },
      },
      {
        type: 'line',
        name: 'ADX',
        showInLegend: true,
        yAxis: 2,
        dataGrouping: {
          approximation: 'average',
          units: this.groupingUnits,
        },
      },
    ],
    xAxis: {
      labels: {
        style: {
          color: '#000',
        },
        align: 'right',
        x: -3,
      }
    },
    yAxis: [
      {
        labels: {
          style: {
            color: '#000',
          },
          align: 'right',
          x: -3,
        },
        title: {
          text: 'OHLC',
        },
        height: '40%',
        lineWidth: 2,
        offset: 20,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          style: {
            color: '#000',
          },
          align: 'right',
          x: -3,
        },
        title: {
          text: 'Volume',
        },
        top: '42%',
        height: '25%',
        offset: 20,
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          style: {
            color: '#000',
          },
          align: 'right',
          x: -3,
        },
        title: {
          text: 'ADX',
        },
        top: '70%',
        height: '32%',
        offset: 20,
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          style: {
            color: '#000',
          },
          align: 'right',
          x: -3,
        },
        title: {
          text: '',
        },
        top: '90%',
        height: '32%',
        offset: 20,
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        // Index 1: The dummy axis for your vertical signals
        title: { text: '' },
        visible: false, // Hides the axis line, labels, and gridlines
        min: 0,
        max: 1,
        opposite: true
      }
    ]
  });

  /**
   * 2. Initialize services
   */
  ohlcvDataService = inject(OhlcvData); // service for aquiring OHLCV data
  destroyRef = inject(DestroyRef); // Modern cleanup in Angular
  indicatorService = inject(IndicatorTaService)
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeService = inject(ThemeService);


  /**
   * Use rxResource to handle the reactive fetch.
   * Removing explicit generics allows TypeScript to infer types correctly.
   * We rename the destructured request to 'assetId' to avoid shadowing 'this.asset'.
   */
  readonly rawData = rxResource<OhlcvDataInterface[], any>(
    {
      params: () => ({ assetId: this.asset().asset }), // renaming asset to assetId just to avoid potential naming conflict
      stream: ({ params }) => interval(60000).pipe( // interval is in miliseconds
        startWith(0), // starts at milisecond 0
        switchMap(() => this.ohlcvDataService.getAllBars(params.assetId).pipe(
          catchError(error => {
            console.error(`Error fetching OHLCV data for asset ${params.assetId}:`, error);
            // Return an empty array to allow the stream to continue without data for this specific poll.
            // This prevents the interval from stopping and ensures the chart doesn't break.
            return of([]);
          })
        )),
        // switchMap()
      )
    }
  );

  // 3. Derived Chart Structure
  readonly chartData = computed(() => {
    const data = this.rawData.value() ?? [];
    const cleanedPrices: OhlcvDataInterface[] = []; // this list will be the one used to populate chartData
    let lastValidEntry: OhlcvDataInterface | null = null; // keeps record of the last valid entry

    data.forEach(
      (item) => {
        const isInvalid: boolean = Number(item.open_price) === 0 || Number(item.high_price) === 0 ||
          Number(item.low_price) === 0 || Number(item.close_price) === 0;
        if (isInvalid && lastValidEntry) {
          cleanedPrices.push({ ...lastValidEntry, timestamp: item.timestamp });
        } else if (!isInvalid) {
          cleanedPrices.push(item);
        }
        // Invalid entries before the first valid one (e.g. an illiquid asset with
        // no trades yet) are dropped rather than pushed as zero-price bars, which
        // would otherwise corrupt the candlesticks and the high/low/average lines
        // (a $0 "low" would always win against any real price).

        if (!isInvalid) {
          lastValidEntry = item;
        }
      }
    )

    return {
      ohlc: cleanedPrices.map(dp =>
        [
          new Date(dp.timestamp).getTime(),
          Number(dp.open_price),
          Number(dp.high_price),
          Number(dp.low_price),
          Number(dp.close_price)
        ]
      ),
      volume: data.map(dp =>
        [
          new Date(dp.timestamp).getTime(),
          Number(dp.volume)
        ]
      )
    };
  });

  // 3b. Slice of chartData().ohlc within the same [dataMax - visibleRangeMs, dataMax]
  // window the chart is actually showing (see followLiveWindow()). High/low/average
  // must be computed from this, not the full loaded session: the Y axis auto-scales
  // to only the visible candles, so a stat from outside that window (e.g. the
  // opening-range high from hours ago) would fall outside the axis's range and its
  // plot line would silently fail to render.
  readonly windowedOhlc = computed(() => {
    const ohlc = this.chartData().ohlc;
    if (ohlc.length === 0) {
      return ohlc;
    }

    const dataMax = ohlc[ohlc.length - 1][0];
    const cutoff = dataMax - this.visibleRangeMs;
    return ohlc.filter(point => point[0] >= cutoff);
  });

  // 4. The Max Value (Reacts to the 60s poll)
  readonly maxHigh = computed(() => {
    const prices = this.windowedOhlc()
      .map(p => ({ date: new Date(p[0]), price: p[2] })) // Index 2 is High
      .filter(p => Number.isFinite(p.price) && p.price > 0);

    if (prices.length === 0) {
      return null;
    }

    const highestPriceObject = prices.reduce((prev, current) => {
      // Logic: if prices are equal, take the more recent date
      if (current.price === prev.price) {
        return current.date > prev.date ? current : prev;
      }
      return current.price > prev.price ? current : prev;
    });

    // To get the "DateTime" string in America/New_York:
    const nyDateTime = highestPriceObject.date.toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "medium", // e.g., Jan 1, 2023
      timeStyle: "short"   // e.g., 4:00 PM
    });

    return { ...highestPriceObject, date: nyDateTime };
  });

  // 5. The Min Value (Reacts to the 60s poll)
  readonly minLow = computed(() => {
    const prices = this.windowedOhlc()
      .map(p => ({ date: new Date(p[0]), price: p[3] })) // Index 3 is Low
      .filter(p => Number.isFinite(p.price) && p.price > 0);

    if (prices.length === 0) {
      return null;
    }

    const lowestPriceObject = prices.reduce((prev, current) => {
      // Logic: if prices are equal, take the more recent date
      if (current.price === prev.price) {
        return current.date > prev.date ? current : prev;
      }
      return current.price < prev.price ? current : prev;
    });

    // To get the "DateTime" string in America/New_York:
    const nyDateTime = lowestPriceObject.date.toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "medium", // e.g., Jan 1, 2023
      timeStyle: "short"   // e.g., 4:00 PM
    });

    return { ...lowestPriceObject, date: nyDateTime };
  });

  // 5b. The average close price over the visible window (Reacts to the 60s poll).
  // Plotted as a horizontal line so it's easy to see whether price is trading
  // above or below its mean - i.e. a quick mean-reversion read.
  readonly avgPrice = computed(() => {
    const closes = this.windowedOhlc()
      .map(point => point[4]) // Index 4 is Close
      .filter(price => Number.isFinite(price) && price > 0);

    if (closes.length === 0) {
      return null;
    }

    return closes.reduce((total, price) => total + price, 0) / closes.length;
  });

  // 6. The latest Close Price Value (Reacts to the 60s poll)
  readonly latestPrice = computed(() => {
    const lastItem = this.chartData().ohlc.at(-1);
    if (!lastItem) {
      return null;
    }

    const lastClosePriceObject = { date: new Date(lastItem[0]), price: lastItem[4] }

    // To get the "DateTime" string in America/New_York:
    const nyDateTime = lastClosePriceObject.date.toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "medium", // e.g., Jan 1, 2023
      timeStyle: "short"   // e.g., 4:00 PM
    });

    return { ...lastClosePriceObject, date: nyDateTime };
  });


  // Gets RSI data
  readonly allRawData = rxResource<ALLModel[], any>(
    {
      params: () => ({ assetId: this.asset().asset }), // renaming asset to assetId just to avoid potential naming conflict
      stream: ({ params }) => this.indicatorService.getAllIndicator(params.assetId).pipe(
        catchError(error => {
          console.error(`Error fetching indicators for asset ${params.id}:`, error);
          // Return an empty array to allow the stream to continue without data for this specific poll.
          // This prevents the interval from stopping and ensures the chart doesn't break.
          return of([]);
        })
      ) // executes the servicegetAssetsLatestPrices(params.id) // executes the service
    }
  );

  // Updates the RSI data structure
  readonly allData = computed(() => {
    const data = this.allRawData.value() ?? [];
    console.log(data)

    return {
      rsi: data.map(dp =>
        [
          new Date(dp.timestamp).getTime(),
          Number(dp.RSI),
        ]
      ),
      adx: data.map(dp =>
        [
          new Date(dp.timestamp).getTime(),
          Number(dp.ADX),
        ]
      ),
      atr: data.map(dp =>
        [
          new Date(dp.timestamp).getTime(),
          Number(dp.ATR),
        ]
      ),
      plus_di: data.map(dp =>
        [
          new Date(dp.timestamp).getTime(),
          Number(dp.DMP),
        ]
      ),
      minus_di: data.map(dp =>
        [
          new Date(dp.timestamp).getTime(),
          Number(dp.DMN),
        ]
      ),
    };
  })

  constructor() {
    // Use an effect to synchronize chart options with data updates. This runs
    // automatically whenever this.chartData() updates, and - via the
    // isDark() read below - whenever the app's dark/light theme toggles, so
    // the chart (which renders to its own <svg> and never picks up CSS
    // variable changes on its own) is kept in sync with the rest of the app.
    effect(() => {
      this.themeService.isDark();

      if (isPlatformBrowser(this.platformId)) {
        const { background, text } = this.themeService.getChartColors();
        if (background && background !== this.componentColor()) {
          this.componentColor.set(background);
        }
        if (text && text !== this.textColor()) {
          this.textColor.set(text);
        }

        // Only call update in the browser to ensure the debugger can catch it
        this.updateChartData();
      }
    });

    // When opened as the fullscreen dialog's content, Material's own open
    // animation can still be resizing the panel by the time Highcharts first
    // measures its container, so give it one more reflow once that settles.
    if (this.dialogRef) {
      this.dialogRef.afterOpened().subscribe(() => {
        requestAnimationFrame(() => this.chart?.reflow());
      });
    }
  }

  /**
   * 3. Class methods
   */

  /**
   * If this instance IS the fullscreen dialog's content, the button closes
   * it. Otherwise (the normal grid-tile instance) it opens a second AssetCard
   * instance - for this same asset - as fullscreen dialog content.
   */
  toggleFullscreen(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }

    this.dialog.open(AssetCard, {
      data: this.asset(),
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'asset-card-fullscreen-dialog',
    });
  }

  updateChartData() {
    const textColor = this.textColor();

    this.chartOptions.update(options => ({
      ...options,
      title: { ...options.title, style: { color: textColor } },
      legend: { ...options.legend, itemStyle: { color: textColor } },
      chart: {
        ...options.chart,
        backgroundColor: this.componentColor()
      },
      xAxis: {
        ...options.xAxis,
        labels: {
          ...(options.xAxis as Highcharts.XAxisOptions).labels,
          style: { ...(options.xAxis as Highcharts.XAxisOptions).labels?.style, color: textColor }
        }
      },
      yAxis: (options.yAxis as Highcharts.YAxisOptions[]).map((axis, i) => ({
        ...axis,
        labels: { ...axis.labels, style: { ...axis.labels?.style, color: textColor } },
        title: { ...axis.title, style: { ...axis.title?.style, color: textColor } },
        ...(i === 0 ? { plotLines: this.buildPriceLevelLines() } : {})
      })),
      navigator: {
        ...options.navigator,
        series: {
          type: 'line',
          data: this.allData().rsi,
          color: '#fc6603',
        }
      },
      series: [
        {
          type: 'candlestick',
          name: 'Stock Prices',
          id: 'main-series',
          data: this.chartData().ohlc,
          dataGrouping: {
            units: this.groupingUnits,
            approximation: 'ohlc',
          },
        },
        {
          type: 'column',
          name: 'Volume',
          data: this.chartData().volume,
          yAxis: 1,
          dataGrouping: {
            approximation: 'sum',
            units: this.groupingUnits,
          },
        },
        {
          type: 'line',
          name: 'ADX',
          data: this.allData().adx,
          color: '#a1066e',
          yAxis: 2,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'line',
          name: '+DI',
          data: this.allData().plus_di,
          color: '#048526',
          yAxis: 2,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'line',
          name: '-DI',
          data: this.allData().minus_di,
          color: '#ec9410',
          yAxis: 2,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'errorbar',
          name: 'ATR %',
          yAxis: 4,
          data: this.allData().atr
            .filter(([_, value]) => value > 0.18)
            .map(([timestamp]) => [
              timestamp, // X coordinate
              0,         // Low Y-bound
              1       // High Y-bound
            ]),
          linkedTo: 'main-series', // Links legend and zooming behavior
          color: '#b4f306',             // Line color
          lineWidth: 2,                 // Line thickness
          whiskerLength: 0,             // Set to 0 to remove the horizontal T-bars
          zIndex: -50,                    // Ensures lines sit on top of candles
          states: {
            hover: {
              lineWidth: 2          // Thicker line on mouse hover
            }
          },
          tooltip: {
            pointFormat: 'ATR / Close > 0.18'
          },
          dataGrouping: {
            enabled: true,
            approximation: 'range',
            forced: true
          }
        }
      ]
    }));
    console.log('Chart updated for ', this.asset().asset);
  }

  /**
   * Horizontal reference lines for the price axis: high/low (same values shown
   * in the card footer) and the average close, so it's visually obvious whether
   * price is trading above or below its mean (mean-reversion cue).
   */
  private buildPriceLevelLines(): Highcharts.YAxisPlotLinesOptions[] {
    const lines: Highcharts.YAxisPlotLinesOptions[] = [];
    const high = this.maxHigh()?.price;
    const low = this.minLow()?.price;
    const avg = this.avgPrice();

    // Labels are staggered (opposite horizontal alignment + vertical nudge) so
    // that when high/low/avg sit close together (a quiet, low-volatility
    // window) the three lines/labels stay legible instead of overlapping.
    if (high !== undefined && high !== null) {
      lines.push({
        value: high,
        color: '#0d9e03',
        width: 1,
        dashStyle: 'Dash',
        zIndex: 5,
        label: { text: `High ${high.toFixed(2)}`, align: 'right', y: -4, style: { color: '#0d9e03' } },
      });
    }

    if (low !== undefined && low !== null) {
      lines.push({
        value: low,
        color: '#c62828',
        width: 1,
        dashStyle: 'Dash',
        zIndex: 5,
        label: { text: `Low ${low.toFixed(2)}`, align: 'right', y: 12, style: { color: '#c62828' } },
      });
    }

    if (avg !== null && avg !== undefined) {
      lines.push({
        value: avg,
        color: '#1976d2',
        width: 1,
        dashStyle: 'ShortDot',
        zIndex: 5,
        label: { text: `Avg ${avg.toFixed(2)}`, align: 'left', y: -4, style: { color: '#1976d2' } },
      });
    }

    return lines;
  }

  /**
   * Captures the live chart instance once Highcharts creates it, and wires a
   * 'redraw' listener that keeps the visible window following live data.
   */
  onChartInstance(chart: Highcharts.Chart): void {
    this.chart = chart as Highcharts.StockChart;
    Highcharts.addEvent(chart, 'redraw', () => this.followLiveWindow());
  }

  /**
   * Re-anchors the X axis to [dataMax - visibleRangeMs, dataMax] whenever new
   * data has actually landed (dataMax advanced since we last followed it).
   * Only acting on a dataMax change means a user's manual zoom/pan (which also
   * fires 'redraw' but doesn't change dataMax) is left untouched.
   */
  private followLiveWindow(): void {
    const chart = this.chart;
    const dataMax = chart ? (chart.xAxis[0] as unknown as { dataMax?: number }).dataMax : undefined;
    if (!chart || dataMax == null || dataMax === this.lastFollowedDataMax) {
      return;
    }
    this.lastFollowedDataMax = dataMax;
    chart.xAxis[0].setExtremes(dataMax - this.visibleRangeMs, dataMax, true);
  }
}
