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

    // 1) Updates this.widgetsInDashboard
    // this.widgetsInDashboard.set([...this.widgetsInDashboard(), {...theWidget}]);
 
    // 2) Deletes content from widget as it cannot be serialized easily.
    const widgetStrippedOfContent: Partial<IWidgetConfig> = theWidget
    delete widgetStrippedOfContent.content;
    
    // 3) Update user preferences.
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
          this.widgetsInDashboard.set([...this.widgetsInDashboard(), {...response}]);
          // // Renders error snack-bar
          // this._snackBar.openFromComponent(
          //   TmytsSnackbar, {
          //     data: {'message': JSON.stringify(response), 'action': 'Close'},
          //     panelClass: ['success-snackbar-theme']
          //   }
          // );
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
    console.log(`widget to be updated: ${JSON.stringify(widget)}`)
    const widgetIndex = this.widgetsInDashboard().findIndex(w => w.id === widget.id)
    console.log(`widget index: ${JSON.stringify(widgetIndex)}`)
    if (widgetIndex != -1){
      const tempWidgets = [...this.widgetsInDashboard()];
      tempWidgets[widgetIndex] = {...tempWidgets[widgetIndex], ...widget};
      this.widgetsInDashboard.set(tempWidgets);

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
            this.widgetsInDashboard.set(response);
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
            this.widgetsInDashboard.set(response);
          },          
        }
    );
  }  
}


