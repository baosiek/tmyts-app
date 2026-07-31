import { Component, computed, effect, inject, input, SimpleChanges } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { ChartConstructorType, HighchartsChartDirective } from 'highcharts-angular';
import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { DialogData } from '../../../../../dialogs/general-dialog/general-dialog';
import { createDefaultWidgetConfigModel, WidgetConfigModel } from '../../../../../../models/widget-config-model';
import { IndicatorService } from '../../../../../../services/indicator/indicator-service';
import * as Highcharts from 'highcharts/highstock';
import * as HIndicatorsAll from "highcharts/indicators/indicators-all";
import * as HDragPanes from "highcharts/modules/drag-panes";
import * as HAnnotationsAdvanced from "highcharts/modules/annotations-advanced";
import * as HPriceIndicator from "highcharts/modules/price-indicator";
import * as HFullScreen from "highcharts/modules/full-screen";
import * as HStockTools from "highcharts/modules/stock-tools";
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { TmytsSnackbar } from '../../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';
import { IndicatorDataMapModel, IndicatorModel } from '../../../../../../models/indicator-model';
import { ThemeService } from '../../../../../../services/theme-service/theme-service';


@Component({
  selector: 'app-macd-widget',
  imports: [
    ...MATERIAL_IMPORTS,
    HighchartsChartDirective,
  ],
  templateUrl: './macd-widget.html',
  styleUrl: './macd-widget.scss'
})
export class MacdWidget {
  
  data = input.required<IWidgetConfig>();
  dialogData = input<DialogData>()
  renderingFrom = 'indicator'
  showChartGui = false

  resolvedData = computed<IWidgetConfig | WidgetConfigModel>(
    () => {
      if (this.dialogData()?.data) {
        this.renderingFrom = 'dialog'
        this.showChartGui = true
        this.chartHeight = '900px'
        this.chartTitle = this.dialogData()?.data.get('dataDialog').symbol

        return this.dialogData()?.data.get('dataDialog')
      } else if (this.data()) {
        this.chartTitle = this.dialogData()?.data.get('dataDialog').title
        return this.data();
      }

      const config = createDefaultWidgetConfigModel()
      return config;
    }
  );

  indicatorService = inject(IndicatorService)
  private themeService = inject(ThemeService)

  chart?: Highcharts.StockChart;
  chartConstructor: ChartConstructorType = 'stockChart';
  chartOptions!: Highcharts.Options;
  updateFlag: boolean = true;
  oneToOneFlag: boolean = true;

  Highcharts: typeof Highcharts = Highcharts;
  HIndicatorsAll: typeof HIndicatorsAll = HIndicatorsAll
  HAnnotationsAdvanced: typeof HAnnotationsAdvanced = HAnnotationsAdvanced
  HPriceIndicator: typeof HPriceIndicator = HPriceIndicator
  HDragPanes: typeof HDragPanes = HDragPanes
  HFullScreen: typeof HFullScreen = HFullScreen
  HStockTools: typeof HStockTools = HStockTools

  chartHeight: string | null = null;
  chartTitle: string = ''

  ohlc: any[] = [];
  macd: any[] = [];
  signal: any[] = [];
  histogram: any[] = [];

  groupingUnits: [string, number[] | null][] = [
    ['week', [1]],
    ['month', [1, 2, 3, 4, 6]]
  ];

  constructor(
    private _snackBar: MatSnackBar
  ) {
    // This chart is built imperatively via Highcharts.stockChart() (see
    // initializeChart()) rather than through Angular's reactive
    // <highcharts-chart> wrapper, so it never picks up CSS variable changes
    // on its own - re-apply its colors whenever the app's theme toggles.
    effect(() => {
      this.themeService.isDark();
      if (!this.chart) {
        return;
      }
      const { background, text } = this.themeService.getChartColors();
      this.chart.update({
        chart: { backgroundColor: background },
        title: { style: { color: text } },
        legend: { itemStyle: { color: text } },
        xAxis: { labels: { style: { color: text } } },
        yAxis: [
          { labels: { style: { color: text } } },
          { labels: { style: { color: text } } },
        ],
      }, true);
    });
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.getIndicatorData();
  }

  getIndicatorData() {
    this.indicatorService.getMACDIndicator([this.resolvedData().symbol])
      .pipe(
        catchError<any, any>(
          (error) => {
            // Handle error response
            const message: string = `Error: ${JSON.stringify(error.error.detail)}`;

            // Renders error snack-bar
            this._snackBar.openFromComponent(
              TmytsSnackbar, {
              data: { 'message': message, 'action': 'Close' },
              panelClass: ['error-snackbar-theme']
            }
            );
            return error
          }
        )
      )
      .subscribe(
        {
          next: (responses: IndicatorDataMapModel) => {
            const chartData: IndicatorModel[] = responses.data_map[this.resolvedData().symbol].indicator_data;
            this.dataIntoChartDataStructure(chartData)
          }
        }
      );
  }

  dataIntoChartDataStructure(chartData: IndicatorModel[]) {
    this.ohlc = [];
    this.macd = [];
    this.signal = [];
    this.histogram = [];
    for (const dataPoint of chartData) {
      this.ohlc.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.open),
          Number(dataPoint.high),
          Number(dataPoint.low),
          Number(dataPoint.close)
        ]
      );
      this.macd.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.indicator['macd'])
        ]
      );
      this.signal.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.indicator['signal'])
        ]
      );
      this.histogram.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.indicator['histogram']),
        ]
      );
    }
    this.initializeChart()
  }

  initializeChart() {
    const { background, text } = this.themeService.getChartColors();
    this.chartOptions = {
      chart: {
        styledMode: false,
        backgroundColor: background,
        style: {
          color: text,
        },
        height: this.chartHeight
      },
      title: {
        text: this.chartTitle,
        style: {
          color: text,
        },
      },
      rangeSelector: {
        selected: 3,
      },
      navigator: {
        series: {
          color: 'orange',
        },
      },
      xAxis: {
        labels: {
          style: {
            color: text,
          },
          align: 'right',
          x: -3,
        },
      },
      yAxis: [
        {
          labels: {
            style: {
              color: text,
            },
          },
          title: {
            text: 'Prices',
          },
          height: '75%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            style: {
              color: text,
            },
            align: 'right',
            x: -3,
          },
          title: {
            text: 'MACD',
          },
          top: '75%',
          height: '25%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      legend: {
        itemStyle: {
          color: text,
        },
        enabled: true
      },
      stockTools: {
        gui: {
          enabled: this.showChartGui,
          buttons: [
            'fullScreen',
            'simpleShapes',
            'lines',
            'crookedLines',
            'measure',
            'advanced',
            'verticalLabels',
            'flags',
            'toggleAnnotations',
            'currentPriceIndicator',
            'saveChart'
          ],
        }
      },
      accessibility: {
        enabled: false,
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
        },
        histogram: {
          
        }
      },
      series: [
        {
          type: 'candlestick',
          name: 'Prices',
          data: this.ohlc,
          dataGrouping: {
            units: this.groupingUnits,
            approximation: 'ohlc',
          },
          showInLegend: true,
        },
        {
          type: 'line',
          name: 'MACD',
          data: this.macd,
          yAxis: 1,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'line',
          name: 'Signal',
          data: this.signal,
          yAxis: 1,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'column',
          name: 'Histogram',
          data: this.histogram,
          color: '#08a60e',
          negativeColor: '#a61308',
          yAxis: 1,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
      ],
      credits: {
        enabled: false,
      },

    };

    // Initializes the chart  iteself.
    this.chart = Highcharts.stockChart(
      `container-${this.resolvedData().label}-${this.renderingFrom}`,
      this.chartOptions
    );
  }

}
