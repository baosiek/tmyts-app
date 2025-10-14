import { Component, computed, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { DialogData } from '../../../../../dialogs/general-dialog/general-dialog';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { createDefaultWidgetConfigModel, WidgetConfigModel } from '../../../../../../models/widget-config-model';
import { IndicatorService } from '../../../../../../services/indicator/indicator-service';
import { ChartConstructorType, HighchartsChartDirective } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
import { IndicatorMap } from '../../../../../../models/indicator-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { TmytsSnackbar } from '../../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';

@Component({
  selector: 'app-adline-widget',
  imports: [
    ...MATERIAL_IMPORTS,
    HighchartsChartDirective,
  ],
  templateUrl: './adline-widget.html',
  styleUrl: './adline-widget.scss'
})
export class AdlineWidget implements OnInit, OnChanges {

  data = input.required<IWidgetConfig>();
  dialogData = input<DialogData>()
  renderingFrom = 'indicator'

  resolvedData = computed<IWidgetConfig | WidgetConfigModel>(
    () => {
      if (this.dialogData()?.data) {
        this.renderingFrom = 'dialog'
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
  ) { }

  ngOnInit() {
    this.getIndicatorData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getIndicatorData();
  }

  getIndicatorData() {
    this.indicatorService.getADLineIndicator([this.resolvedData().symbol])
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
          next: (responses: IndicatorMap[]) => {
            // console.log(responses)
            this.dataIntoChartDataStructure(responses)
          }
        }
      );
  }

  dataIntoChartDataStructure(responses: IndicatorMap[]) {
    this.ohlc = []
    this.volume = []
    this.obv = []
    const response = responses.find(r => r.symbol === this.resolvedData().symbol)
    if (response) {
      const entries = response.indicator_data
      for (const entry of entries) {
        this.ohlc.push(
          [
            Number(entry.date),
            Number(entry.open),
            Number(entry.high),
            Number(entry.low),
            Number(entry.close)
          ]
        );
        this.volume.push(
          [
            Number(entry.date),
            Number(entry.volume)
          ]
        );
        this.obv.push(
          [
            Number(entry.date),
            Number(entry.indicator)
          ]
        );
      }
      this.initializeChart()
    }
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
