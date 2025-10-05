import { Component, inject, signal } from '@angular/core';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { ToolbarService } from '../../../../services/tmyts-toolbar/tmyts-toolbar-service';
import { TmytsToolbar } from '../../../reusable-components/tmyts-toolbar/tmyts-toolbar';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { JsonPipe } from '@angular/common';
import { TmytsWidget } from "../../../reusable-components/tmyts-widget/tmyts-widget";
import { IWidgetConfig } from '../../../../interfaces/widget-config-interface';
import { ObvWidget } from './asset-analysis-widgets/obv-widget/obv-widget';
import { AssetsAnalysisDashboardService } from '../../../../services/assets-analysis-dashboard/assets-analysis-dashboard-service';

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
  symbol: string | null = null;

  widgetConfigService = inject(AssetsAnalysisDashboardService);

  constructor() {
    this.dashboardService.dialogTypes().find(
      (dashboard) => {
        if (dashboard) {
          if (dashboard.id === this.id){
            this.data = dashboard;
          }          
        }        
      }
    );
  }

  parentNotified(value: Map<String, any>){
    this.result.set(value)
    this.symbol = this.result().get('symbol').symbol
  }
}

