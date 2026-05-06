import { CurrencyPipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, input, InputSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from "@angular/material/divider";
import { MatProgressBar } from "@angular/material/progress-bar";
import * as Highcharts from 'highcharts';
import { ChartConstructorType, HighchartsChartComponent, providePartialHighcharts } from 'highcharts-angular';
import 'highcharts/modules/stock';
import { interval, startWith, switchMap } from 'rxjs';
import { OhlcvDataInterface } from '../../../../../interfaces/ohlcv-interface';
import { PortfolioHoldingsModel } from '../../../../../models/portfolio_holdings_model';
import { OhlcvData } from '../../../../../services/ohlcv-data/ohlcv-data';


@Component({
  selector: 'app-asset-card',
  imports: [MatCardModule, HighchartsChartComponent, CurrencyPipe, MatProgressBar, MatDivider],
  templateUrl: './asset-card.html',
  styleUrl: './asset-card.scss',
  providers: [
    providePartialHighcharts(  // importing this module is crutial to enable stockChart
      { modules: () => [import('highcharts/esm/modules/stock')] }
    )
  ]
})
export class AssetCard {

  /**
   * 1. Class variables
   */
  asset: InputSignal<PortfolioHoldingsModel> = input.required<PortfolioHoldingsModel>(); // asset for this card
  Highcharts: typeof Highcharts = Highcharts; // Highcharts library boilerplate code
  chartConstructor: ChartConstructorType = 'stockChart'; // Chart constructor type
  // ohlc: any[] = []; // data structure to insert OHLCV prices
  volume: any[] = []; // data structure to insert OHLCV volume
  chart?: Highcharts.StockChart;
  // highestClosePrice = computed<number>(() => this.getHighestClosePriceNumber());

  groupingUnits: [string, number[] | null][] = [
    ['minute', [15, 30]],
    // ['hour', [1, 2,]]
  ];



  /**
   * componentColor gets the color of the background color of the card
   */
  componentColor = getComputedStyle(document.documentElement).getPropertyValue('--mat-sys-surface').trim()

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
      selected: 3,
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
          type: 'all',
          text: 'All',
          title: 'View all'
        }
      ]
    },
    navigator: {
      series: {
        color: 'orange',
      },
    },
    chart: {
      backgroundColor: this.componentColor,
      styledMode: false,
      height: null
    },
    legend: { enabled: true },
    credits: { enabled: false },
    tooltip: { enabled: true },
    plotOptions: {
      candlestick: {
        color: 'pink',
        lineColor: 'red',
        upColor: 'green',
        upLineColor: 'darkgreen',
      },
      column: {
        color: 'blue',
      }
    },
    series: [
      {
        type: 'candlestick',
        name: 'Prices',
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
    ],
    xAxis: {
      labels: {
        style: {
          color: '#000',
        },
        align: 'right',
        x: -3,
      },
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
          align: 'high',
          rotation: 90,
          x: 5,
          y: 10,
        },
        height: '60%',
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
          align: 'high',
          rotation: 90,
          x: 5,
          y: 10,
        },
        top: '65%',
        height: '35%',
        offset: 20,
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
    ]
  });

  /**
   * 2. Initialize services
   */
  ohlcvDataService = inject(OhlcvData); // service for aquiring OHLCV data
  destroyRef = inject(DestroyRef); // Modern cleanup in Angular

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
        switchMap(() => this.ohlcvDataService.getLast100Entries(params.assetId)) // executes the service
      )
    }
  );

  // 3. Derived Chart Structure
  readonly chartData = computed(() => {
    const data = this.rawData.value() ?? [];
    return {
      ohlc: data.map(dp =>
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

  // 4. The Max Value (Reacts to the 60s poll)
  readonly maxHigh = computed(() => {
    const prices = this.chartData().ohlc.map(p => ({ date: new Date(p[0]), price: p[2] })); // Index 2 is High

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
    console.log(nyDateTime);

    return { ...highestPriceObject, date: nyDateTime };
  });

  // 5. The Min Value (Reacts to the 60s poll)
  readonly minLow = computed(() => {
    const prices = this.chartData().ohlc.map(p => ({ date: new Date(p[0]), price: p[3] })); // Index 3 is Low

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

  constructor() {
    // Use an effect to synchronize chart options with data updates.
    // This runs automatically whenever this.chartData() updates.
    effect(() => {
      this.updateChartData();
    });
  }

  /**
   * 3. Class methods
   */

  updateChartData() {
    this.chartOptions.update(options => ({
      ...options,
      series: [
        {
          type: 'candlestick',
          name: 'Stock Prices',
          data: this.chartData().ohlc
        },
        {
          type: 'column',
          name: 'Volume',
          data: this.chartData().volume,
          yAxis: 1
        },
      ]
    }));
  }
}
