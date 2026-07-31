import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { PortfolioComponentsDataExchange } from '../../../../interfaces/portfolio-components-data-exchange';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { PortfolioModel } from '../../../../models/portfolio-model';
import { PortfolioHoldingsModel } from '../../../../models/portfolio_holdings_model';
import { AuthUserModel } from '../../../../models/auth-user-model';
import { AuthService } from '../../../../services/auth/auth-service';
import { PortfolioDatabaseService } from '../../../../services/portfolio-database/portfolio-database-service';
import { ToolbarService } from '../../../../services/tmyts-toolbar/tmyts-toolbar-service';
import { UserService } from '../../../../services/user-service/user-service';
import { TmytsToolbar } from '../../../reusable-components/tmyts-toolbar/tmyts-toolbar';
import { AssetsPriceUpdate } from "./assets-price-update/assets-price-update";
import { ProcessingStatus } from "./processing-status/processing-status";

@Component({
  selector: 'app-control-panel',
  imports: [TmytsToolbar, MatSelectModule, FormsModule, AssetsPriceUpdate, ProcessingStatus],
  templateUrl: './control-panel.html',
  styleUrl: './control-panel.scss',
})
export class ControlPanel {

  /*
    Define all class variables
    */
  id: string = 'control-panel'; // id of this component
  toolbar: ITmytsToolBar | undefined; // receives this component toolbar configuration
  // Guaranteed non-null: authGuard blocks navigation to this route while unauthenticated.
  user_id: number = inject(AuthService).userId()!;
  selectedPortfolio: string = ''; // holds the user selected portfolio
  portfolioList: PortfolioModel[] = []; // a list containing all portfolios registered to the user

  // data exchanged with children so they can filter their content
  // to the assets held by the selected portfolio
  dataExchangeToChild = PortfolioComponentsDataExchange.create(this.user_id, '', []);

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
      .getUser()
      .pipe(
        catchError((error) => {
          throw error;
        }),
      )
      .subscribe({
        next: (response: AuthUserModel) => {
          // Handle successful response)
          this.selectedPortfolio = response.portfolio_name as string;
          this.updatePortfolioList();
          if (this.selectedPortfolio) {
            this.onPortfolioChange();
          }
        },
        error: () => {
          // Handle error response
        },
      });
  }

  /*
  Method retrieves all portfolios registered to the user
  via PortfolioDBService. If the user has laready selected one
  in the other panels it is set to be the default. Otherwise
  the first in the list is selected
  */
  updatePortfolioList() {
    this.portfilioDbService
      .readAllPortfolios()
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
            this.onPortfolioChange();
          }
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

  /*
  Called whenever the selected portfolio changes (either by the user
  via mat-select or programmatically upon init). It fetches the
  portfolio's holdings and forwards the resulting asset list to the
  children (e.g. AssetsPriceUpdate) so they can filter their content.
  */
  onPortfolioChange(): void {
    if (!this.selectedPortfolio) {
      this.dataExchangeToChild = PortfolioComponentsDataExchange.create(
        this.user_id,
        '',
        [],
      );
      return;
    }

    this.portfilioDbService
      .getPortfolioHoldings(this.selectedPortfolio)
      .pipe(
        catchError((error) => {
          throw error;
        }),
      )
      .subscribe({
        next: (response: PortfolioHoldingsModel[]) => {
          const assets = response.map((holding) => holding.asset);
          this.dataExchangeToChild = PortfolioComponentsDataExchange.create(
            this.user_id,
            this.selectedPortfolio,
            assets,
          );
        },
        error: (error) => {
          // Handle error response
          this._snackBar.open(
            `HTTPError:${error.status}:
              No holdings found for portfolio ${this.selectedPortfolio}.`,
            'Close',
          );
        },
      });
  }

}
