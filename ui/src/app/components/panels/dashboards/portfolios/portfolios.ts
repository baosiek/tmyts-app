import { Component, inject, OnInit, signal } from '@angular/core';
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
import { PortfolioDatabaseService } from '../../../../services/portfolio-database/portfolio-database-service';
import { catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-portfolios',
  imports: [
    ...MATERIAL_IMPORTS,
    TmytsToolbar,
    PortfolioTableRud,
    PortfolioTableRenderer,
    FormsModule
  ],
  templateUrl: './portfolios.html',
  styleUrl: './portfolios.scss'
})

export class Portfolios implements OnInit{

  protected id: string = 'portfolio'
  user_id: string = 'baosiek'
  portfolioService = inject(PortfolioDashboardService);
  portfilioDbService = inject(PortfolioDatabaseService)
  data: ITmytsToolBar | undefined;
  portfolioList: PortfolioModel[] = []
  dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  selectedPortfolio!: string;

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

  ngOnInit(): void {
    this.updatePortfolioList();
  }

  add() {
    const dialogRef = this.dialog.open(
      GeneraliDialog,
      {
        data: {
          title: "Add new portfolio",
          user_id: this.user_id,
          content: AddPortfolioDialog
        }
      }
    )
    dialogRef.afterClosed().subscribe(
      () => {
        this.updatePortfolioList();
      }
    )
  }

  updatePortfolioList() {
    this.portfilioDbService.readAllPortfolios(this.user_id)
      .pipe(
        catchError(
          (error) => {
            throw error
          }
        )
      )
      .subscribe(
        {
          next: (response: PortfolioModel[]) => {
            // Handle successful response
            this.portfolioList = [ ...response ]
            const [firstPortfolio] = response;
            this.selectedPortfolio = firstPortfolio.portfolio_id;
          },
          error: (error) => {
            // Handle error response
            this._snackBar.open(`HTTPError:${error.status}: 
              No portfolios found for user_id ${this.user_id}.`, 'Close');
          }
        }
      );
    }
}
