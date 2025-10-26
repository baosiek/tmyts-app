import { Component, computed, ElementRef, inject, input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { IndicatorService } from '../../../../../../services/indicator/indicator-service';
import { catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TmytsSnackbar } from '../../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';
import { ChartConstructorType, HighchartsChartDirective } from 'highcharts-angular';
import { IndicatorDataMapModel, IndicatorModel } from '../../../../../../models/indicator-model';
import { DialogData } from '../../../../../dialogs/general-dialog/general-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { createDefaultWidgetConfigModel, WidgetConfigModel } from '../../../../../../models/widget-config-model';
import * as Highcharts from 'highcharts/highstock';
import * as HIndicatorsAll from "highcharts/indicators/indicators-all";
import * as HDragPanes from "highcharts/modules/drag-panes";
import * as HAnnotationsAdvanced from "highcharts/modules/annotations-advanced";
import * as HPriceIndicator from "highcharts/modules/price-indicator";
import * as HFullScreen from "highcharts/modules/full-screen";
import * as HStockTools from "highcharts/modules/stock-tools";


@Component({
  selector: 'app-obv-widget',
  imports: [
    ...MATERIAL_IMPORTS,
    HighchartsChartDirective,
  ],
  templateUrl: './obv-widget.html',
  providers: [

  ],
  styleUrl: './obv-widget.scss'
})
export class ObvWidget implements OnChanges {

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
  chartHeight: string | null = null;
  chartTitle: string = ''

  ohlc: any[] = [];
  volume: any[] = [];
  obv: any[] = [];

  groupingUnits: [string, number[] | null][] = [
    ['week', [1]],
    ['month', [1, 2, 3, 4, 6]]
  ];

  constructor(
    private _snackBar: MatSnackBar
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getIndicatorData();
  }

  getIndicatorData(){
    this.indicatorService.getObvIndicator([this.resolvedData().symbol])
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
    this.obv = []
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
      this.obv.push(
        [
          Number(dataPoint.date),
          Number(dataPoint.indicator['obv'])
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
            text: 'Prices',
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
            text: 'OBV',
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
        enabled: true
      },
      stockTools: {
        // You can also customize the GUI here
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
          name: 'obv',
          data: this.obv,
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
