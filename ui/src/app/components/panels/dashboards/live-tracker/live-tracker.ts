import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { PortfolioModel } from '../../../../models/portfolio-model';
import { PortfolioHoldingsModel } from '../../../../models/portfolio_holdings_model';
import { UserModel } from '../../../../models/user-model';
import { PortfolioDatabaseService } from '../../../../services/portfolio-database/portfolio-database-service';
import { ToolbarService } from '../../../../services/tmyts-toolbar/tmyts-toolbar-service';
import { UserService } from '../../../../services/user-service/user-service';
import { TmytsToolbar } from "../../../reusable-components/tmyts-toolbar/tmyts-toolbar";
import { AssetCard } from "./asset-card/asset-card";

@Component({
  selector: 'app-live-tracker',
  imports: [TmytsToolbar, MatSelectModule, FormsModule, MatGridListModule, AssetCard],
  templateUrl: './live-tracker.html',
  styleUrl: './live-tracker.scss'
})
export class LiveTracker implements OnInit {

  /*
  Define all class variables
  */
  id: string = 'live_tracker'; // id of this component
  toolbar: ITmytsToolBar | undefined; // receives this component toolbar configuration
  user_id: number = 1; // there is no user functionality, so user_id is fixed. Needs to change in the future
  selectedPortfolio: string = ''; // holds the user selected portfolio
  portfolioList: PortfolioModel[] = []; // a list containing all portfolios registered to the user
  assetsList: PortfolioHoldingsModel[] = []; // a list containing all assets in the seleted portfolio


  /*
  1. Injects all required services
  */

  /*
  1.1 Injects toolbar service which enables toolbar
      rendering via configuration
  */
  toolbarService = inject(ToolbarService);

  /*
  1.2 Injects UserService, sevice through which the user
      saved configuration is retrieved
  */
  userService = inject(UserService);

  /*
  1.3 Injects the portfolio service, service through which
      the user can load data related to existing portfolio
  */
  portfilioDbService = inject(PortfolioDatabaseService);



  //*************************************************
  // CLASS METHODS
  //*************************************************

  constructor(private _snackBar: MatSnackBar) {
    /*
    Loads the toolbar configuration
    */
    this.toolbarService.dialogTypes().find((dashboard) => {
      if (dashboard) {
        if (dashboard.id === this.id) {
          this.toolbar = dashboard;
        }
      }
    });

    /*
    Loads user configuration whith his/her preferences
    */
    this.userService
      .getUser(this.user_id)
      .pipe(
        catchError((error) => {
          throw error;
        }),
      )
      .subscribe({
        next: (response: UserModel) => {
          // Handle successful response)
          this.selectedPortfolio = response.portfolio_name as string;
          this.updatePortfolioList();
        },
        error: (error) => {
          // Handle error response
        },
      });
  }


  ngOnInit(): void {
    this.updatePortfolioList();
  }

  /*
  This method is called everytime a portfolio is selected
  on mat-select directive within mat-form-field. As we make use 
  of two-way-binding with [(ngModel)]="selectedPortfolio" in mat-select 
  there is no need to associate $event to selectedPortfolio
  */
  onPortfolioChange($event: any) {
    /*
    Once the selected portfolio changes, the next step is to 
    get all its assets.
    */
    this.getPortfolioAssets()
  }

  /*
  Method retrieves all portfolios registered to the user
  via PortfolioDBService. If the user has laready selected one
  in the other panels it is set to be the default. Otherwise
  the first in the list is selected
  */
  updatePortfolioList() {
    this.portfilioDbService
      .readAllPortfolios(this.user_id)
      .pipe(
        catchError((error) => {
          throw error;
        }),
      )
      .subscribe({
        next: (response: PortfolioModel[]) => {
          // Handle successful response updating portfolio list
          this.portfolioList = [...response];

          // typescript syntax to get the first element
          const [firstPortfolio] = this.portfolioList;

          /* upon this component init, selectedPortfolio is zero, 
            thus it selects automatically the first portfolio in portfolioList*/
          if (!this.selectedPortfolio) {
            this.selectedPortfolio = firstPortfolio.portfolio_name;
          }

          /*
          Once the portfolio is selected, the next step is to 
          get all its assets.
          */
          this.getPortfolioAssets()
        },
        error: (error) => {
          // Handle error response
          this._snackBar.open(
            `HTTPError:${error.status}: 
              No portfolios found for user_id ${this.user_id}.`,
            'Close',
          );
        },
      });
  }

  getPortfolioAssets() {
    console.log(`Will get assets to portfolio: ${this.selectedPortfolio}`)
    this.portfilioDbService.getPortfolioHoldings(this.user_id, this.selectedPortfolio)
      .subscribe(
        {
          next: (response: PortfolioHoldingsModel[]) => {
            console.log(`number of assets in ${this.selectedPortfolio} is: ${response.length}`);
            this.assetsList = [...response];
          }
        }
      );
  }
}
