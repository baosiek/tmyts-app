import { Component, computed, inject, input, SimpleChanges } from '@angular/core';
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
  volume: any[] = [];
  macd: any[] = [];
  signal: any[] = [];
  histogram: any[] = [];

  groupingUnits: [string, number[] | null][] = [
    ['week', [1]],
    ['month', [1, 2, 3, 4, 6]]
  ];

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
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
    this.volume = [];
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
      this.volume.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.volume)
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
    const componentColor = getComputedStyle(document.documentElement).getPropertyValue('--mat-sys-surface').trim()
    const data = this.histogram;
    this.chartOptions = {
      chart: {
        styledMode: false,
        backgroundColor: componentColor,
        style: {
          color: '#000',
        },
        height: this.chartHeight
      },
      title: {
        text: this.chartTitle,
        style: {
          color: '#000',
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
          },
          title: {
            text: 'OLHC',
          },
          height: '45%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '45%',
          height: '25%',
          offset: 0,
          lineWidth: 2,
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'MACD',
          },
          top: '70%',
          height: '30%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      legend: {
        itemStyle: {
          color: '#000',
        },
      },
      stockTools: {
        gui: {
          enabled: this.showChartGui,
          buttons: [
            'fullScreen',
            'simpleShapes',
            'lines',
            'crookedLines',
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
          name: 'OHLC',
          data: this.ohlc,
          dataGrouping: {
            units: this.groupingUnits,
            approximation: 'ohlc',
          },
          showInLegend: false,
        },
        {
          type: 'column',
          name: 'Volume',
          data: this.volume,
          yAxis: 1,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'line',
          name: 'MACD',
          data: this.macd,
          yAxis: 2,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'line',
          name: 'Signal',
          data: this.signal,
          yAxis: 2,
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
          yAxis: 2,
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
