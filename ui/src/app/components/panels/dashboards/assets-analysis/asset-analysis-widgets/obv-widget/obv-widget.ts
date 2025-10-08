import { AfterViewInit, Component, ElementRef, HostListener, inject, input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { IWidgetConfig } from '../../../../../../interfaces/widget-config-interface';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { IndicatorService } from '../../../../../../services/indicator/indicator-service';
import { catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TmytsSnackbar } from '../../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';
import { ChartConstructorType, HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-obv-widget',
  imports: [
    ...MATERIAL_IMPORTS,
    HighchartsChartComponent,
  ],
  templateUrl: './obv-widget.html',
  styleUrl: './obv-widget.scss'
})
export class ObvWidget implements OnInit {

  @ViewChild('chartComp', { static: false }) chartComponent!: HighchartsChartComponent;
  @ViewChild('test', { static: false, read: ElementRef }) testDiv!: ElementRef;

  private chartRef?: Highcharts.Chart;

  private resizeObserver?: ResizeObserver;

  data = input.required<IWidgetConfig>();
  indicatorService = inject(IndicatorService)

  chart?: Highcharts.Chart;

  updateFlag: boolean = true;
  oneToOneFlag: boolean = true;

  chartOptions: Highcharts.Options = {
    series: [
      {
        data: [1, 2, 3],
        type: 'line',
        zIndex: 5
      },
    ],
    chart: {
      type: 'line',
      height: null,
      reflow: true,
      animation: false,
      marginBottom: 40,
    },
    credits: {
      enabled: false
    },
    xAxis: {
      title: {
        text: 'X Axis',
        margin: 10 // Reduce margin if needed
      },
      labels: {
        reserveSpace: true // Prevent labels from being hidden
      }
    }
  };

  chartConstructor: ChartConstructorType = 'chart'; // Optional, defaults to 'chart'

  constructor(private _snackBar: MatSnackBar) { }


  ngOnInit(): void {

    this.indicatorService.getObvIndicator([this.data().symbol])
      .pipe(
        catchError(
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
          next: (response) => {
            console.log(response['AAPL'])
          }
        }
      );
  }

  onChartInstance(chart: Highcharts.Chart) {
    this.chartRef = chart;
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartRef) {
        this.chartRef.reflow();
      }
    });
    if (this.testDiv?.nativeElement) {
      this.resizeObserver.observe(this.testDiv.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver && this.testDiv?.nativeElement) {
      this.resizeObserver.unobserve(this.testDiv.nativeElement);
      this.resizeObserver.disconnect();
    }
  }

}

