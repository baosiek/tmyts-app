import { Component, inject } from '@angular/core';
import { TmytsToolbar } from "../../../sub-components/tmyts-toolbar/tmyts-toolbar";
import { PortfolioTypeService } from '../../../../services/portfolio-type/portfolio-type-service';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';

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
  portfolioService = inject(PortfolioTypeService);
  data: ITmytsToolBar | undefined;

  constructor() {
    this.portfolioService.dialogTypes().find(
      (portfolio) => {
        if (portfolio) {
          if (portfolio.id === this.id){
            this.data = portfolio;
          }          
        }        
      }
    );
  }


}
