import { computed, effect, inject, Injectable, signal, Type } from '@angular/core';
import { IWidgetConfig, IWidgetType, WidgetConfig } from '../../interfaces/widget-config-interface';
import { ObvWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/obv-widget/obv-widget';
import { AdlineWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/adline-widget/adline-widget';
import { AdxWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/adx-widget/adx-widget';
import { AroonWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/aroon-widget/aroon-widget';
import { UserPreferencesService } from '../user-preferences/user-preferences-service';
import { catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TmytsSnackbar } from '../../components/reusable-components/tmyts-snackbar/tmyts-snackbar';
import { MacdWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/macd-widget/macd-widget';
import { FibonacciWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/fibonacci-widget/fibonacci-widget';
import { SarWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/sar-widget/sar-widget';
import { BollingerWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/bollinger-widget/bollinger-widget';
import { RsiWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/rsi-widget/rsi-widget';
import { StochasticWidget } from '../../components/panels/dashboards/assets-analysis/asset-analysis-widgets/stochastic-widget/stochastic-widget';

/*
providedIn: 'root' deleted from @Injectable, because
this service will be required only for the refered 
dashboard.
*/
@Injectable() 
export class AssetsAnalysisDashboardService {

  widgetTypes = signal<IWidgetType[]>(
    [
      {
        id: 1,
        dashboard_id: 'assets_analysis',
        label: 'obv',
        title: 'On-Balance Volume (OBV) indicator',
        content: ObvWidget,
      },
      {
        id: 2,
        dashboard_id: 'assets_analysis',
        label: 'ad-line',
        title: 'Accumulation/Distribution Line (A/D Line)',
        content: AdlineWidget,
      },
      {
        id: 3,
        dashboard_id: 'assets_analysis',
        label: 'adx',
        title: 'Average Directional Index (ADX)',
        content: AdxWidget,
      },
      {
        id: 4,
        dashboard_id: 'assets_analysis',
        label: 'aroon',
        title: 'Aroon Indicator',
        content: AroonWidget,
      },
      {
        id: 5,
        dashboard_id: 'assets_analysis',
        label: 'macd',
        title: 'Moving Average Convergence Divergence (MACD) Indicator',
        content: MacdWidget,
      },
      {
        id: 6,
        dashboard_id: 'assets_analysis',
        label: 'rsi',
        title: 'The Relative Strength Index (RSI)',
        content: RsiWidget,
      },
      {
        id: 7,
        dashboard_id: 'assets_analysis',
        label: 'stochastic',
        title: 'Stochastic Oscillator',
        content: StochasticWidget,
      },
      {
        id: 8,
        dashboard_id: 'assets_analysis',
        label: 'fibonacci',
        title: 'Fibonacci Retracement',
        content: FibonacciWidget,
      },
      {
        id: 9,
        dashboard_id: 'assets_analysis',
        label: 'sar',
        title: 'Parabolic SAR',
        content: SarWidget,
      },
      {
        id: 10,
        dashboard_id: 'assets_analysis',
        label: 'bollinger',
        title: 'Bollinger Bands',
        content: BollingerWidget,
      }
    ]
  );

    // holds all existing types of widgets for this dashboard service
  widgetsStore = signal<IWidgetConfig[]>([]);
  
  // user preference storing service
  userPreferenceService = inject(UserPreferencesService)

  // holds all widgets added to the dashboard
  widgetsInDashboard = signal<IWidgetConfig[]>([])

  // the difference between widgetsStore minus widgetsInDashboard
  // meaning all widgets that can still be added to the dashboard
  widgetsToBeAdded  = computed(
    () => {
      const idsInDashboard = this.widgetsInDashboard().map((w) => w.id);
      const widgets = this.widgetsStore().filter((w) =>  !idsInDashboard.includes(w.id));
      return this.widgetTypes().filter((w) =>  !idsInDashboard.includes(w.id));
    }      
  );

  constructor(private _snackBar: MatSnackBar){}

  addWidgetToDashboard(user_id: number, symbol: string, widget: IWidgetType) {

    console.log(`widget to be updated into possql: ${JSON.stringify(widget)}`)
    const theWidget = new WidgetConfig(
      widget.id,
      user_id,
      widget.dashboard_id,
      widget.label,
      widget.title,
      symbol,
      widget.content,
      1,
      1,
      'var(--mat-sys-surface)',
      'var(--mat-sys-on-surface)'
    )
 
    // 1) Deletes content from widget as it cannot be serialized easily.
    const widgetStrippedOfContent: Partial<IWidgetConfig> = theWidget
    delete widgetStrippedOfContent.content;
    
    // 1) Update user preferences.
    this.userPreferenceService.insertWidgetConfig(widgetStrippedOfContent)
    .pipe(
      catchError(
        (error) => {
          // Handle error response
          const message: string = `Error: ${JSON.stringify(error.error.detail)}`;

          // Renders error snack-bar
          this._snackBar.openFromComponent(
            TmytsSnackbar, {
              data: {'message': message, 'action': 'Close'},
              panelClass: ['error-snackbar-theme']
            }
          );
          throw error;
        }
      )
    )
    .subscribe(
      {
        next: (response: IWidgetConfig) => {
          const widgets = [...this.widgetsInDashboard(), {...response}];
          this.reInsertContentIntoWidget(widgets)
        }
      }
    );    
  }


  updateWidget(widget: Partial<IWidgetConfig>) {
    /* 
    First finds the indes of the widget to be updated.
    Then update the widget with ...widget
    Sets the new values to widgetsInDashboard
    Finally updates the user preferences
    */
    const widgetIndex = this.widgetsInDashboard().findIndex(w => w.id === widget.id)
    if (widgetIndex != -1){
      const tempWidgets = [...this.widgetsInDashboard()];
      tempWidgets[widgetIndex] = {...tempWidgets[widgetIndex], ...widget};

      const user_id = tempWidgets[widgetIndex].user_id;
      const dashboard_id = tempWidgets[widgetIndex].dashboard_id;

      this.userPreferenceService.updateWidgets(user_id, dashboard_id, tempWidgets)
      .pipe(
        catchError(
          (error) => {
            // Handle error response
            const message: string = `Error: ${JSON.stringify(error)}`;

            // Renders error snack-bar
            this._snackBar.openFromComponent(
              TmytsSnackbar, {
                data: {'message': message, 'action': 'Close'},
                panelClass: ['error-snackbar-theme']
              }
            );
            throw error;
          }
        )        
      )
      .subscribe(
        {
          next: (response: IWidgetConfig[]) => {
            this.reInsertContentIntoWidget(response);
          },          
        }
      );
    }   
  }

  deleteWidgetFromDashboard(widget: IWidgetConfig){
    const id: number = widget.id;
    const user_id: number = widget.user_id;
    const dashboard_id: string = widget.dashboard_id;

    this.userPreferenceService.deleteWidget(id, user_id, dashboard_id)
    .pipe(
      catchError(
          (error) => {
            // Handle error response
            const message: string = `Error: ${JSON.stringify(error)}`;

            // Renders error snack-bar
            this._snackBar.openFromComponent(
              TmytsSnackbar, {
                data: {'message': message, 'action': 'Close'},
                panelClass: ['error-snackbar-theme']
              }
            );
            throw error;
          }
        )  
    )
    .subscribe(
      {
          next: (response: IWidgetConfig[]) => {
            this.reInsertContentIntoWidget(response);
          },          
        }
    );
  }

  reInsertContentIntoWidget(configArray: IWidgetConfig[]) {
    // reinserts content into configArray
    configArray.forEach(
      (item) => {
        const content = this.widgetTypes().find(w => item.label === w.label)?.content;
        if (content) {
          item.content = content;
        }        
      }
    )

    // updates widgetsInDashboard
    this.widgetsInDashboard.set(configArray);
  }
}


