import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { PortfolioComponentsDataExchange } from '../../../../interfaces/portfolio-components-data-exchange';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { PortfolioModel } from '../../../../models/portfolio-model';
import { PortfolioDatabaseService } from '../../../../services/portfolio-database/portfolio-database-service';
import { ToolbarService } from '../../../../services/tmyts-toolbar/tmyts-toolbar-service';
import { AddPortfolioDialog } from '../../../dialogs/add-portfolio-dialog/add-portfolio-dialog';
import { GeneraliDialog } from '../../../dialogs/general-dialog/general-dialog';
import { TmytsToolbar } from '../../../reusable-components/tmyts-toolbar/tmyts-toolbar';
import { IndexesCards } from "../../indexes-cards/indexes-cards";
import { PortfolioPerformanceTable } from "./portfolio-tables/portfolio-performance-table/portfolio-performance-table";
import { PortfolioTableRud } from "./portfolio-tables/portfolio-table-rud/portfolio-table-rud";
@Component({
  selector: 'app-portfolios',
  imports: [
    ...MATERIAL_IMPORTS,
    TmytsToolbar,
    PortfolioTableRud,
    FormsModule,
    PortfolioPerformanceTable,
    IndexesCards
],
  templateUrl: './portfolios.html',
  styleUrl: './portfolios.scss'
})

export class Portfolios implements OnInit{

  protected id: string = 'portfolio'
  user_id: number = 1
  portfolioService = inject(ToolbarService);
  portfilioDbService = inject(PortfolioDatabaseService)
  data: ITmytsToolBar | undefined;
  portfolioList: PortfolioModel[] = []
  dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  selectedPortfolio: number = 0;

  dataExchangeToChild = PortfolioComponentsDataExchange.create(0, 0, []);

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
    // Set the attributes to pass to the actual dialog, not the General one
    const data: Map<string, any> = new Map<string, any>()
    data.set('userId', this.user_id)
    const dialogRef = this.dialog.open(
      GeneraliDialog,
      {
        data: {
          title: "Add new portfolio",
          data: data,
          content: AddPortfolioDialog
        }
      }
    )
    dialogRef.afterClosed().subscribe(
      (response) => {
        const createdPortfolio: PortfolioModel = response as PortfolioModel
        this.selectedPortfolio = createdPortfolio.id
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
            // Handle successful response updating portfolio list
            this.portfolioList = [ ...response ]

            // typescript syntax to get the first element
            const [firstPortfolio] = this.portfolioList;

            /* upon this component init selectedPortfolio is zero, 
            thus it selects automatically the first portfolio in portfolioList*/
            if (this.selectedPortfolio == 0) {
              this.selectedPortfolio = firstPortfolio.id;
            }
            
          },
          error: (error) => {
            // Handle error response
            this._snackBar.open(`HTTPError:${error.status}: 
              No portfolios found for user_id ${this.user_id}.`, 'Close');
          }
        }
      );
    }

    receiveMessage(event: PortfolioComponentsDataExchange){
      this.dataExchangeToChild = event;
    }
}
