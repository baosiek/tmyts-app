import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { PortfolioComponentsDataExchange } from '../../../../interfaces/portfolio-components-data-exchange';
import { ITmytsToolBar } from '../../../../interfaces/tmyts-toolbar-interface';
import { PortfolioModel } from '../../../../models/portfolio-model';
import { UserModel } from '../../../../models/user-model';
import { PortfolioDatabaseService } from '../../../../services/portfolio-database/portfolio-database-service';
import { ToolbarService } from '../../../../services/tmyts-toolbar/tmyts-toolbar-service';
import { UserService } from '../../../../services/user-service/user-service';
import { TmytsToolbar } from '../../../reusable-components/tmyts-toolbar/tmyts-toolbar';
import { WeekChart } from './week-chart/week-chart';
import { LiveAssetPerformance } from './live-asset-performance/live-asset-performance';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-live-data',
  imports: [
    TmytsToolbar,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    LiveAssetPerformance,
    WeekChart,
    MatDialogModule,
  ],
  templateUrl: './live-data.html',
  styleUrl: './live-data.scss',
})
export class LiveData implements OnInit {
  protected id: string = 'live_data';

  user_id: number = 1;
  portfilioId: number = 0;
  userService = inject(UserService);

  toolbarService = inject(ToolbarService);
  portfilioDbService = inject(PortfolioDatabaseService);
  data: ITmytsToolBar | undefined;

  portfolioList: PortfolioModel[] = [];
  selectedPortfolio: number | null = 0;

  dataExchangeToChild = PortfolioComponentsDataExchange.create(0, 0, []);

  constructor(private _snackBar: MatSnackBar) {
    this.toolbarService.dialogTypes().find((dashboard) => {
      if (dashboard) {
        if (dashboard.id === this.id) {
          this.data = dashboard;
        }
      }
    });

    this.userService
      .getUser(this.user_id)
      .pipe(
        catchError((error) => {
          throw error;
        }),
      )
      .subscribe({
        next: (response: UserModel) => {
          this.selectedPortfolio = response.portfolio_id;
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

          /* upon this component init selectedPortfolio is zero, 
            thus it selects automatically the first portfolio in portfolioList*/
          if (this.selectedPortfolio == 0) {
            this.selectedPortfolio = firstPortfolio.id;
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
}
