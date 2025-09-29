import { Component, inject, signal } from '@angular/core';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { PortfolioDashboardService } from '../../../../services/portfolio-dashboard/portfolio-type-service';
import { TmytsToolbar } from '../../../sub-components/tmyts-toolbar/tmyts-toolbar';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-assets-analysis',
  imports: [
    ...MATERIAL_IMPORTS,
    TmytsToolbar
  ],
  templateUrl: './assets-analysis.html',
  styleUrl: './assets-analysis.scss'
})
export class AssetsAnalysis {

  protected id: string = 'assets_analysis'
  dashboardService = inject(PortfolioDashboardService);
  data: ITmytsToolBar | undefined;
  result = signal<Map<String, any>>(new Map())


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
    console.log("parent notified: ", this.result().size)
  }
}

