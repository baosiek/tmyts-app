import { Component, computed, inject, input, SimpleChanges } from '@angular/core';
import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { DialogData } from '../../../../../dialogs/general-dialog/general-dialog';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { createDefaultWidgetConfigModel, WidgetConfigModel } from '../../../../../../models/widget-config-model';
import { IndicatorService } from '../../../../../../services/indicator/indicator-service';
import { ChartConstructorType, HighchartsChartDirective } from 'highcharts-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { TmytsSnackbar } from '../../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';
import * as Highcharts from 'highcharts/highstock';
import * as HIndicatorsAll from "highcharts/indicators/indicators-all";
import * as HDragPanes from "highcharts/modules/drag-panes";
import * as HAnnotationsAdvanced from "highcharts/modules/annotations-advanced";
import * as HPriceIndicator from "highcharts/modules/price-indicator";
import * as HFullScreen from "highcharts/modules/full-screen";
import * as HStockTools from "highcharts/modules/stock-tools";
import { IndicatorDataMapModel, IndicatorModel } from '../../../../../../models/indicator-model';


@Component({
  selector: 'app-bollinger-widget',
  imports: [
    ...MATERIAL_IMPORTS,
    HighchartsChartDirective,
  ],
  templateUrl: './bollinger-widget.html',
  styleUrl: './bollinger-widget.scss'
})
export class BollingerWidget {

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
  middle: any[] = [];
  lower: any[] = [];
  upper: any[] = [];

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
    this.indicatorService.getBollingerIndicator([this.resolvedData().symbol])
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
    this.ohlc = []
    this.volume = []
    this.middle = []
    this.upper = []
    this.lower = []
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
      this.middle.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.indicator['middle'])
        ]
      );
      this.lower.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.indicator['lower'])
        ]
      );
      this.upper.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.indicator['upper'])
        ]
      );
    }
    this.initializeChart()
  }

  initializeChart() {
    const componentColor = getComputedStyle(document.documentElement).getPropertyValue('--mat-sys-surface').trim()
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
          height: '100%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
      ],
      legend: {
        itemStyle: {
          color: '#000',
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
            'measure',
            'advanced',
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
          showInLegend: true,
        },
        {
          type: 'line',
          name: 'Upper band',
          data: this.upper,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'line',
          name: 'Middle band',
          data: this.middle,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'line',
          name: 'Lower and',
          data: this.lower,
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
