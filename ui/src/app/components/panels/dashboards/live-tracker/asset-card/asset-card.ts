import { Component, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import * as Highcharts from 'highcharts';
import { HighchartsChartDirective } from "highcharts-angular";
import { PortfolioHoldingsModel } from '../../../../../models/portfolio_holdings_model';

@Component({
  selector: 'app-asset-card',
  imports: [MatCardModule, HighchartsChartDirective],
  templateUrl: './asset-card.html',
  styleUrl: './asset-card.scss'
})
export class AssetCard {

  /**
   * Class variables
   */
  asset = input.required<PortfolioHoldingsModel>();
  updateFlag: boolean = false

  Highcharts: typeof Highcharts = Highcharts;

  componentColor = getComputedStyle(document.documentElement).getPropertyValue('--mat-sys-surface').trim()

  // Define chart options as a signal
  chartOptions = signal<Highcharts.Options>({
    title: { text: undefined },
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
      type: 'line',
      data: [1, 3, 2, 4]
    }]
  });

}
