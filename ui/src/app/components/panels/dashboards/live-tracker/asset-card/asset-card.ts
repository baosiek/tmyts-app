import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import * as Highcharts from 'highcharts';
import { PortfolioHoldingsModel } from '../../../../../models/portfolio_holdings_model';
import { HighchartsChartComponent } from "highcharts-angular";

@Component({
  selector: 'app-asset-card',
  imports: [MatCardModule, HighchartsChartComponent],
  templateUrl: './asset-card.html',
  styleUrl: './asset-card.scss'
})
export class AssetCard {

  /**
   * Class variables
   */
  asset = input.required<PortfolioHoldingsModel>();

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    title: { text: 'Angular 21 Line Chart' },
    series: [{
      data: [1, 2, 3, 4, 5],
      type: 'line'
    }]
  };

}
