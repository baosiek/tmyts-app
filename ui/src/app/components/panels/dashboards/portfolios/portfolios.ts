import { Component, inject } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { TmytsToolbar } from '../../../sub-components/tmyts-toolbar/tmyts-toolbar';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { PortfolioDashboardService } from '../../../../services/portfolio-dashboard/portfolio-type-service';
import { PortfolioModel } from '../../../../models/portfolio-model';
import { PortfolioTableRud } from "./portfolio-tables/portfolio-table-rud/portfolio-table-rud";
import { PortfolioTableRenderer } from "./portfolio-tables/portfolio-table-renderer/portfolio-table-renderer";
import { MatDialog } from '@angular/material/dialog';
import { AddPortfolioDialog } from '../../../dialogs/add-portfolio-dialog/add-portfolio-dialog';
import { GeneraliDialog } from '../../../dialogs/general-dialog/general-dialog';
@Component({
  selector: 'app-portfolios',
  imports: [
    ...MATERIAL_IMPORTS,
    TmytsToolbar,
    PortfolioTableRud,
    PortfolioTableRenderer
  ],
  templateUrl: './portfolios.html',
  styleUrl: './portfolios.scss'
})

export class Portfolios {

  protected id: string = 'portfolio'
  portfolioService = inject(PortfolioDashboardService);
  data: ITmytsToolBar | undefined;
  portfolioList: PortfolioModel[] = []
  dialog = inject(MatDialog);

  constructor() {
    this.portfolioService.dialogTypes().find(
      (portfolio) => {
        if (portfolio) {
          if (portfolio.id === this.id) {
            this.data = portfolio;
          }
        }
      }
    );
  }

  add() {
    console.log("Add button clicked!")
    const dialogRef = this.dialog.open(
      GeneraliDialog,
      {
        data: {
          title: "Add new portfolio",
          content: AddPortfolioDialog
        }
      }
    )
    dialogRef.afterClosed().subscribe(result => {
      const portfolioModel = result as PortfolioModel
      console.log(`result: ${portfolioModel.portfolio_id}`)
    });

  }
}
