import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { TmytsToolbar } from '../../../sub-components/tmyts-toolbar/tmyts-toolbar';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { PortfolioDashboardService } from '../../../../services/portfolio-dashboard/portfolio-type-service';
@Component({
  selector: 'app-portfolios',
  imports: [
    ...MATERIAL_IMPORTS,
    TmytsToolbar
  ],
  templateUrl: './portfolios.html',
  styleUrl: './portfolios.scss'
})

export class Portfolios {

  protected id: string = 'portfolio'
  portfolioService = inject(PortfolioDashboardService);
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
