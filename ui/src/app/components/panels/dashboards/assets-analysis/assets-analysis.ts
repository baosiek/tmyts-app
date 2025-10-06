import { Component, inject, OnInit, signal } from '@angular/core';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { ToolbarService } from '../../../../services/tmyts-toolbar/tmyts-toolbar-service';
import { TmytsToolbar } from '../../../reusable-components/tmyts-toolbar/tmyts-toolbar';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { TmytsWidget } from "../../../reusable-components/tmyts-widget/tmyts-widget";
import { IWidgetConfig } from '../../../../interfaces/widget-config-interface';
import { AssetsAnalysisDashboardService } from '../../../../services/assets-analysis-dashboard/assets-analysis-dashboard-service';
import { UserPreferencesService } from '../../../../services/user-preferences/user-preferences-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { TmytsSnackbar } from '../../../reusable-components/tmyts-snackbar/tmyts-snackbar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-assets-analysis',
  imports: [
    ...MATERIAL_IMPORTS,
    TmytsToolbar,
    TmytsWidget,
    TmytsWidget,
    // JsonPipe
],
providers: [
  AssetsAnalysisDashboardService // this service is required only here
],
  templateUrl: './assets-analysis.html',
  styleUrl: './assets-analysis.scss'
})
export class AssetsAnalysis {

  protected id: string = 'assets_analysis'
  user_id: number = 1
  dashboardService = inject(ToolbarService);
  data: ITmytsToolBar | undefined;
  result = signal<Map<String, any>>(new Map())
  symbol: string = '';

  widgetConfigService = inject(AssetsAnalysisDashboardService);
  userPreferenceService = inject(UserPreferencesService)

  constructor(private _snackBar: MatSnackBar) {

    this.dashboardService.dialogTypes().find(
      (dashboard) => {
        if (dashboard) {
          if (dashboard.id === this.id){
            this.data = dashboard;
          }          
        }        
      }
    );

    this.userPreferenceService.getAllWidgets(this.user_id, this.id)
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
        next: (response: IWidgetConfig[]) => {
          this.widgetConfigService.reInsertContentIntoWidget(response);
          // response.forEach(
          //   (r) => {
          //     const content = this.widgetConfigService.widgetTypes().find(w => w.id === r.id)?.content;
          //     if (content) {
          //       r.content = content;
          //     }
          //   }
          // );
          // this.widgetConfigService.widgetsInDashboard.set(response);
          if (this.widgetConfigService.widgetsInDashboard().length > 0){
            const w: IWidgetConfig | undefined = this.widgetConfigService.widgetsInDashboard().at(0)
            if (w) {
              this.symbol = w.symbol;
              console.log(`set symbol is: ${this.symbol}`)
            }            
          } else {
             this.symbol = '';
          }
        }
      }
    );
  }

  parentNotified(value: Map<String, any>){
    this.result.set(value)
    this.symbol = this.result().get('symbol').symbol
  }

  drop(event: CdkDragDrop<string[]>) {
    const temp = this.widgetConfigService.widgetsInDashboard();
    moveItemInArray(temp, event.previousIndex, event.currentIndex);
    this.userPreferenceService.updateWidgets(this.user_id, this.id, temp)
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
        next: (response: IWidgetConfig[]) => {
          this.widgetConfigService.reInsertContentIntoWidget(response);
        }
      }
    );
  }
}

