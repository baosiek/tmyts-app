import { Component, inject } from '@angular/core';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { PortfolioDashboardService } from '../../../../services/portfolio-dashboard/portfolio-type-service';
import { TmytsToolbar } from '../../../sub-components/tmyts-toolbar/tmyts-toolbar';

@Component({
  selector: 'app-assets-analysis',
  imports: [
    TmytsToolbar
  ],
  templateUrl: './assets-analysis.html',
  styleUrl: './assets-analysis.scss'
})
export class AssetsAnalysis {

  protected id: string = 'assets_analysis'
  dashboardService = inject(PortfolioDashboardService);
  data: ITmytsToolBar | undefined;

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
}
