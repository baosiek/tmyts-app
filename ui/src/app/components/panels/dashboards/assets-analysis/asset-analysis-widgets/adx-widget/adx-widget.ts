import { Component, computed, effect, inject, input, SimpleChanges } from '@angular/core';
import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { DialogData } from '../../../../../dialogs/general-dialog/general-dialog';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { createDefaultWidgetConfigModel, WidgetConfigModel } from '../../../../../../models/widget-config-model';
import { IndicatorService } from '../../../../../../services/indicator/indicator-service';
import { ChartConstructorType, HighchartsChartDirective } from 'highcharts-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { TmytsSnackbar } from '../../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';
import { IndicatorDataMapModel, IndicatorModel } from '../../../../../../models/indicator-model';
import { ThemeService } from '../../../../../../services/theme-service/theme-service';
import * as Highcharts from 'highcharts/highstock';
import * as HIndicatorsAll from "highcharts/indicators/indicators-all";
import * as HDragPanes from "highcharts/modules/drag-panes";
import * as HAnnotationsAdvanced from "highcharts/modules/annotations-advanced";
import * as HPriceIndicator from "highcharts/modules/price-indicator";
import * as HFullScreen from "highcharts/modules/full-screen";
import * as HStockTools from "highcharts/modules/stock-tools";

@Component({
  selector: 'app-adx-widget',
  imports: [
    ...MATERIAL_IMPORTS,
    HighchartsChartDirective,
  ],
  templateUrl: './adx-widget.html',
  styleUrl: './adx-widget.scss'
})
export class AdxWidget {

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
  adx: any[] = [];
  di_plus: any[] = [];
  di_minus: any[] = [];

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

  ngOnChanges(changes: SimpleChanges): void {
    this.getIndicatorData();
  }

  getIndicatorData(){
    this.indicatorService.getADXIndicator([this.resolvedData().symbol])
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
    this.adx = [];
    this.di_plus = [];
    this.di_minus = [];
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
      this.adx.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.indicator['adx'])
        ]
      );
      this.di_plus.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.indicator['plus_di'])
        ]
      );
      this.di_minus.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.indicator['minus_di'])
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
            text: 'ADX',
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
          name: '+DI',
          data: this.di_plus,
          yAxis: 1,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'line',
          name: '-DI',
          data: this.di_minus,
          yAxis: 1,
          dataGrouping: {
            approximation: 'average',
            units: this.groupingUnits,
          },
        },
        {
          type: 'line',
          name: 'ADX',
          data: this.adx,
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
