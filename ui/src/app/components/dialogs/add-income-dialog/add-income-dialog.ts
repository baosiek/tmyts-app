import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of } from 'rxjs';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { PortfolioActivityModel, SymbolByPortfolioTotalsModel } from '../../../models/portfolio-activity-model';
import { ReturnMessage } from '../../../models/return-message';
import { PortfolioActivityService } from '../../../services/portfolio-activity/portfolio-activity-service';
import { TmytsSnackbar } from '../../reusable-components/tmyts-snackbar/tmyts-snackbar';
import { DialogData } from '../general-dialog/general-dialog';

@Component({
  selector: 'app-add-income-dialog',
  imports: [
    ...MATERIAL_IMPORTS,
    NgClass,
    FormsModule
  ],
  templateUrl: './add-income-dialog.html',
  styleUrl: './add-income-dialog.scss'
})
export class AddIncomeDialog implements OnInit {

  // Initializes valiables
  // Term to perform quick search
  userId: number = 0;
  portfolioId: number = 0;
  selectedSymbol: SymbolByPortfolioTotalsModel | null = null;
  pickedDate = { value: new Date() }
  cash_in: number = 0;
  spinnerFlagIsEmpty: boolean = false;


  // Initializes signals
  // Holds data passed from PortfolioTableRud component
  dialogData = input.required<DialogData>()

  // Initializes required services
  portfolioActivityService = inject(PortfolioActivityService)

  // Initializes the table datasource
  displayedColumns: string[] = ['symbol', 'symbol_name', 'broker_name', 'cash_in', 'purchase_date', 'add'];
  dataSource: MatTableDataSource<SymbolByPortfolioTotalsModel> = new MatTableDataSource();

  constructor(
    public dialogRef: MatDialogRef<AddIncomeDialog>,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userId = this.dialogData().data.get('userId');
    this.portfolioId = this.dialogData().data.get('portfolioId');
    this.spinnerFlagIsEmpty = true;
    this.portfolioActivityService.getSymbolsTotalsByPortfolio(this.userId, this.portfolioId)
      .pipe(
        catchError(
          (error) => {
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
            this.spinnerFlagIsEmpty = false;
          }
          
        }
      );
  }

  selectRow(row: SymbolByPortfolioTotalsModel) {
    this.selectedSymbol = row;
  }

  add(element: SymbolByPortfolioTotalsModel) {
    const activity: Partial<PortfolioActivityModel> = {
      user_id: element.user_id,
      portfolio_id: element.portfolio_id,
      symbol: element.symbol,
      quantity: 0,
      purchase_price: 0,
      purchase_date: this.pickedDate.value,
      broker_id: element.broker_id,
      cash_in: Number(this.cash_in),
      fees: 0
    }

    this.portfolioActivityService.addSellTransaction(activity)
    .subscribe(
      {
        next: (response: ReturnMessage) => {
          // sends back to this dialog caller the response
          this.dialogRef.close(response)

          // informs the user
          const message: string = `Income:[${response.message}] was added to the portfolio.`;
          this._snackBar.openFromComponent(
            TmytsSnackbar, {
              data: { 'message': message, 'action': 'dismiss' },
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
      },
    );
  }
}
