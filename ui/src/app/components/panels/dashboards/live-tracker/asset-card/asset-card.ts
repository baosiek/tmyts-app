import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HighchartsChartDirective } from "highcharts-angular";
import * as Highcharts from 'highcharts/highstock'; // Import Highstock specifically
import { OhlcvDataInterface } from '../../../../../interfaces/ohlcv-interface';
import { PortfolioHoldingsModel } from '../../../../../models/portfolio_holdings_model';
import { OhlcvData } from '../../../../../services/ohlcv-data/ohlcv-data';

@Component({
  selector: 'app-asset-card',
  imports: [MatCardModule, HighchartsChartDirective],
  templateUrl: './asset-card.html',
  styleUrl: './asset-card.scss'
})
export class AssetCard implements OnInit {

  /**
   * 1. Class variables
   */
  asset = input.required<PortfolioHoldingsModel>(); // asset for this card
  Highcharts: typeof Highcharts = Highcharts; // Highcharts library boilerplate code
  ohlc: any[] = []; // data structure to insert OHLCV prices
  volume: any[] = []; // data structure to insert OHLCV volume

  /**
   * componentColor gets the color of the background color of the card
   */
  componentColor = getComputedStyle(document.documentElement).getPropertyValue('--mat-sys-surface').trim()

  /**
   * Define chart options as a signal
   */
  chartOptions = signal<Highcharts.Options>({
    title: { text: 'Live OHLCV Data' },
    rangeSelector: { enabled: true },
    chart: {
      backgroundColor: this.componentColor,
      styledMode: false,
      height: null
    },
    legend: { enabled: true },
    credits: { enabled: false },
    tooltip: { enabled: false },
    plotOptions: {
      series: {
        marker: { enabled: true },
        lineWidth: 4,
        states: { hover: { lineWidth: 4 } },
        color: '#1976d2'
      }
    },
    series: [{
      type: 'candlestick', // or 'ohlc'
      name: 'Stock Price',
      data: [
        [1714291200000, 150.1, 155.4, 149.2, 153.8], // Sample point
        [1714291200000, 150.1, 155.4, 149.2, 153.8], // Sample point
        [1714291200000, 150.1, 155.4, 149.2, 153.8], // Sample point
      ]
    }]
  });

  /**
   * 2. Initialize services
   */
  ohlcvDataService = inject(OhlcvData);

  /**
   * 3. Class methods
   */
  ngOnInit(): void {
    this.ohlcvDataService.getLast100Entries(this.asset().asset)
      .subscribe({
        next: (response) => {
          console.log(response);
        }
      });
  }

  dataIntoChartDataStructure(chartData: OhlcvDataInterface[]) {
    this.ohlc = []
    this.volume = []
    for (const dataPoint of chartData) {
      this.ohlc.push(
        [
          Number(dataPoint.timestamp),
          Number(dataPoint.open_price),
          Number(dataPoint.high_price),
          Number(dataPoint.low_price),
          Number(dataPoint.close_price)
        ]
      );
      this.volume.push(
        [
          Number(dataPoint.timestamp),
          Number(dataPoint.volume)
        ]
      );
    }
    // this.initializeChart()
  }


}
