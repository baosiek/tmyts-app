import { Component, inject, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { TmytsToolbar } from '../../../sub-components/tmyts-toolbar/tmyts-toolbar';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { PortfolioDashboardService } from '../../../../services/portfolio-dashboard/portfolio-type-service';
import { AssetsAnalysisDashboardService } from '../../../../services/assets-analysis-dashboard/assets-analysis-dashboard-service';
import { TmytsWidget } from "../../../sub-components/tmyts-widget/tmyts-widget";

@Component({
  selector: 'app-asset-analysis',
  imports: [
    ...MATERIAL_IMPORTS,
    TmytsToolbar,
    TmytsWidget
],
  providers: [
    AssetsAnalysisDashboardService // this service is required only here
  ],
  templateUrl: './asset-analysis.html',
  styleUrl: './asset-analysis.scss'
})
export class AssetAnalysis {

  protected id: string = 'assets_analysis'
  dashboardService = inject(PortfolioDashboardService);
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
