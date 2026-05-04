import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import * as Highcharts from 'highcharts';
import { ChartConstructorType, HighchartsChartComponent, providePartialHighcharts } from 'highcharts-angular';
import 'highcharts/modules/stock';
import { OhlcvDataInterface } from '../../../../../interfaces/ohlcv-interface';
import { PortfolioHoldingsModel } from '../../../../../models/portfolio_holdings_model';
import { OhlcvData } from '../../../../../services/ohlcv-data/ohlcv-data';


@Component({
  selector: 'app-asset-card',
  imports: [MatCardModule, HighchartsChartComponent],
  templateUrl: './asset-card.html',
  styleUrl: './asset-card.scss',
  providers: [
    providePartialHighcharts(  // importing this module is crutial to enable stockChart
      { modules: () => [import('highcharts/esm/modules/stock')] }
    )
  ]
})
export class AssetCard implements OnInit {

  /**
   * 1. Class variables
   */
  asset = input.required<PortfolioHoldingsModel>(); // asset for this card
  Highcharts: typeof Highcharts = Highcharts; // Highcharts library boilerplate code
  chartConstructor: ChartConstructorType = 'stockChart'; // Chart constructor type
  ohlc: any[] = []; // data structure to insert OHLCV prices
  volume: any[] = []; // data structure to insert OHLCV volume
  chart?: Highcharts.StockChart;

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
      selected: 1
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
      },
      {
        type: 'column',
        name: 'Volume',
        showInLegend: true,
        yAxis: 1
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
  ohlcvDataService = inject(OhlcvData);

  constructor() {
    // Candlestick module is initialized via import
  }

  /**
   * 3. Class methods
   */
  ngOnInit(): void {
    this.ohlcvDataService.getLast100Entries(this.asset().asset)
      .subscribe({
        next: (response) => {
          console.log(`Response: ${JSON.stringify(response)}`);
          this.dataIntoChartDataStructure(response);
          this.updateChartData();
        }
      });
  }

  dataIntoChartDataStructure(chartData: OhlcvDataInterface[]) {
    this.ohlc = []
    this.volume = []
    for (const dataPoint of chartData) {
      this.ohlc.push(
        [
          Number(new Date(dataPoint.timestamp).getTime()),
          Number(dataPoint.open_price),
          Number(dataPoint.high_price),
          Number(dataPoint.low_price),
          Number(dataPoint.close_price)
        ]
      );
      this.volume.push(
        [
          Number(new Date(dataPoint.timestamp).getTime()),
          Number(dataPoint.volume)
        ]
      );
    }
    this.updateChartData()
  }

  updateChartData() {
    this.chartOptions.update(options => ({
      ...options,
      series: [
        {
          type: 'candlestick',
          name: 'Stock Prices',
          data: this.ohlc
        },
        {
          type: 'column',
          name: 'Volume',
          data: this.volume,
          yAxis: 1
        },
      ]
    }));
  }
}
