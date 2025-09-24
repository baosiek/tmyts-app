import { Component, inject, input, NgModule, OnInit, signal } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { MatTableDataSource } from '@angular/material/table';
import { PortfolioActivityModel, SymbolByPortfolioTotalsModel } from '../../../models/portfolio-activity-model';
import { DatePipe, NgClass } from '@angular/common';
import { DialogData } from '../general-dialog/general-dialog';
import { PortfolioActivityService } from '../../../services/portfolio-activity/portfolio-activity-service';
import { catchError } from 'rxjs';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormsModule, NgModel } from '@angular/forms';

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
export class AddIncomeDialog implements OnInit{

  // Initializes valiables
  // Term to perform quick search
  userId: number = 0;
  portfolioId: number = 0;
  selectedSymbol: SymbolByPortfolioTotalsModel | null = null;
  pickedDate = {value: new Date()}
  cash_in: number = 0

  // Initializes signals
  // Holds data passed from PortfolioTableRud component
  data = input.required<DialogData>()

  // Initializes required services
  portfolioActivityService = inject(PortfolioActivityService)

  // Initializes the table datasource
  displayedColumns: string[] = ['symbol', 'symbol_name', 'broker_name', 'cash_in', 'purchase_date', 'add'];
  dataSource: MatTableDataSource<SymbolByPortfolioTotalsModel> = new MatTableDataSource();

  ngOnInit(): void {
    this.userId = this.data().data.get('userId')
    this.portfolioId = this.data().data.get('portfolioId')
    this.portfolioActivityService.getSymbolsTotalsByPortfolio(this.userId, this.portfolioId)
    .pipe(
      catchError(
        (error) => {
          throw error;
        }
      )
    )
    .subscribe(
      (response) => {
        this.dataSource.data = response;
      }
    );
  }

  selectRow(row: SymbolByPortfolioTotalsModel) {
    this.selectedSymbol = row;
  }

  add(element: SymbolByPortfolioTotalsModel) {
    const activity: Partial<PortfolioActivityModel> = {
      id: 0,
      user_id: element.user_id,
      portfolio_id: element.portfolio_id,
      symbol_id: element.symbol_id,
      quantity: 0,
      purchase_price: 0,
      purchase_date: this.pickedDate.value,
      broker_id: element.broker_id,
      cash_in: Number(this.cash_in),
      fees: 0
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
        (response) => {
          console.log(`Response is: ${response}`);
        }
      ); 
  }  

}
