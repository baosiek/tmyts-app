import { Component, inject, input, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogData } from '../general-dialog/general-dialog';
import { PortfolioActivityService } from '../../../services/portfolio-activity/portfolio-activity-service';
import { catchError, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { PortfolioActivityModel, SymbolByPortfolioTotalsModel } from '../../../models/portfolio-activity-model';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ReturnMessage } from '../../../models/return-message';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TmytsSnackbar } from '../../sub-components/tmyts-snackbar/tmyts-snackbar';

@Component({
  selector: 'app-sell-asset-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    CurrencyPipe
  ],
  templateUrl: './sell-asset-dialog.html',
  styleUrl: './sell-asset-dialog.scss'
})
export class SellAssetDialog implements OnInit{

  // Injects the formbuilder to create the forms
  private _formBuilder = inject(FormBuilder);

  // Injects services
  portfolioActivityService = inject(PortfolioActivityService)

  // Initializes valiables
  // Term to perform quick search
  term: string | null | undefined = ''
  userId: number = 0;
  portfolioId: number = 0;
  selectedSymbol: SymbolByPortfolioTotalsModel | null = null;
  quantityToSell: number | null = 0;
  spinnerFlagIsSet: boolean = false;


  // Initializes signals
  // Holds data passed from PortfolioTableRud component
  data = input.required<DialogData>()

  // Initializes the table datasource
  displayedColumns: string[] = ['symbol', 'symbol_name', 'broker_name', 'total_quantity', 'total_fees', 'average_purchase_price', 'current_price', 'sell'];
  dataSource: MatTableDataSource<SymbolByPortfolioTotalsModel> = new MatTableDataSource();
  
  constructor(public dialogRef: MatDialogRef<SellAssetDialog>, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.userId = this.data().data.get('userId');
    this.portfolioId = this.data().data.get('portfolioId');
    this.spinnerFlagIsSet = true;
    this.portfolioActivityService.getSymbolsTotalsByPortfolio(this.userId, this.portfolioId)
    .pipe(
      catchError(
        (error) => {
          // Renders error snack-bar
          this._snackBar.openFromComponent(
            TmytsSnackbar, {
              data: {'message': JSON.stringify(error), 'action': 'Close'},
              panelClass: ['error-snackbar-theme']
            }
          );
          return of([]);
        }
      )
    )
    .subscribe(
      { 
        next: (response: SymbolByPortfolioTotalsModel[]) => {
          this.dataSource.data = response;
        },
        complete: () => {
           this.spinnerFlagIsSet = false;
        }
      }
    )
  }

  selectRow(row: SymbolByPortfolioTotalsModel) {
    this.selectedSymbol = row;
  }

  sell(element: SymbolByPortfolioTotalsModel) {
    const selected = this.dataSource.data.find(el => el.symbol_id === element.symbol_id)
    if (selected) {
      const activity: Partial<PortfolioActivityModel> = {
        id: 0,
        user_id: selected.user_id,
        portfolio_id: selected.portfolio_id,
        symbol_id: selected.symbol_id,
        quantity: selected.total_quantity * -1,
        purchase_price: selected.current_price,
        purchase_date: new Date(),
        broker_id: selected.broker_id,
        cash_in: 0,
        fees: selected.total_fees
      }

      this.portfolioActivityService.addSellTransaction(activity)
      .pipe(
        catchError(
          (error) => {
            throw error;
          }
        )
      )
      .subscribe(
        {
          next: (response: ReturnMessage) => {
            // Handle successful response
            // Sends the response obtained from the service to [portfolios] component
            this.dialogRef.close(response)
  
            // Renders success snack-bar
            const message: string = `Asset[${response.message}] was sold`;
            this._snackBar.openFromComponent(
              TmytsSnackbar, {
                data: {'message': message, 'action': 'dismiss'},
                panelClass: ['success-snackbar-theme']
              }
            );
          },
          error: (error) => {
            // Handle error response
            const message: string = `Error: ${JSON.stringify(error.error.detail)}`;
  
            // Renders error snack-bar
            this._snackBar.openFromComponent(
              TmytsSnackbar, {
                data: {'message': message, 'action': 'Close'},
                panelClass: ['error-snackbar-theme']
              }
            );
          }
        }
      );
    }    
  }
}
