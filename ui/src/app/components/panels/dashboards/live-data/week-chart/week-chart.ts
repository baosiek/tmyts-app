import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import Highcharts from 'highcharts';
import { HighchartsChartDirective } from 'highcharts-angular';

@Component({
  selector: 'app-week-chart',
  imports: [CommonModule, MatCardModule, HighchartsChartDirective],
  templateUrl: './week-chart.html',
  styleUrl: './week-chart.scss'
})
export class WeekChart {
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      animation: false
    },
    plotOptions: {
      series: {
        animation: false
      },
      line: {
        animation: false
      }
    },
    title: { text: 'Monthly Sales Data 2026' },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yAxis: { title: { text: 'Units Sold' } },
    series: [{
      type: 'line',
      name: 'Product A',
      data: [150, 230, 180, 420, 310, 560],
      animation: false
    }]
  };
}
