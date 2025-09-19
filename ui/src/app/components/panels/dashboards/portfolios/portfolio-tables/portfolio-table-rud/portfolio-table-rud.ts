import { Component, EventEmitter, inject, input, InputSignal, OnInit, Output } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, GeneraliDialog } from '../../../../../dialogs/general-dialog/general-dialog';
import { BuyStockDialog } from '../../../../../dialogs/buy-stock-dialog/buy-stock-dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PortfolioActivityMode, PortfolioActivityModel } from '../../../../../../models/portfolio-activity-model';
import { PortfolioActivityService } from '../../../../../../services/portfolio-activity/portfolio-activity-service';
import { catchError } from 'rxjs';
import { PortfolioComponentsDataExchange } from '../../../../../../interfaces/portfolio-components-data-exchange';

@Component({
  selector: 'app-portfolio-table-rud',
  imports: [
    ...MATERIAL_IMPORTS,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './portfolio-table-rud.html',
  styleUrl: './portfolio-table-rud.scss'
})
export class PortfolioTableRud implements OnInit {

  // portfolioId = input.required<string>()
  dialog = inject(MatDialog);

  portfolioActivityService = inject(PortfolioActivityService)

  displayedColumns: string[] = ['symbol', 'symbol_name', 'purchase_price', 'quantity', 'purchase_date', 'broker_name', 'sell', "delete"];
  dataSource: MatTableDataSource<PortfolioActivityModel> = new MatTableDataSource();

  userId: InputSignal<number> = input.required<number>()
  portfolioId: InputSignal<number> = input.required<number>()

  @Output() portfolioExchangeData = new EventEmitter<PortfolioComponentsDataExchange>();

  portfilioSymbols: string[] = []

  ngOnInit(): void {
    this.getPortfolioActivityContent(
      this.userId(),
      this.portfolioId()
    );
  }

  getPortfolioActivityContent(userId: number, portfolioId: number) {
    this.portfolioActivityService.getActivityForPortfolio(this.userId(), portfolioId)
      .pipe(
        catchError(
          (error) => {
            console.log(error)
            throw error
          }
        )
      )
      .subscribe(
        (response) => {
          this.dataSource.data = response;
          const symbols: string[] = []
          response.forEach(
            item => {
              symbols.push(item.symbol)
            }
          )
          const dataExchange = PortfolioComponentsDataExchange.create(
            this.userId(),
            this.portfolioId(),
            symbols
          )
          this.portfolioExchangeData.emit(dataExchange)
        }
      )
  }

  buyStock() {
    // Set the attributes to pass to the actual dialog, not the General one
    const actualDialogData = new DialogData();

    actualDialogData.addProperty('portfolioId', this.portfolioId);
    const dialogRef = this.dialog.open(
      GeneraliDialog,
      {
        data: {
          title: "Buy stock",
          content: BuyStockDialog,
          actualDialogData: actualDialogData
        }
      }
    )
    dialogRef.afterClosed().subscribe(
      () => {
        this.getPortfolioActivityContent(
          this.userId(),
          this.portfolioId()
        );
      }
    )
  }

  editRow(element: PortfolioActivityMode) {
    console.log(`editing symbol: ${element.symbol_id}`)
  }

  deleteRow(element: PortfolioActivityModel) {
    this.portfolioActivityService.deleteActivityForPortfolio(element.id)
    .pipe(
        catchError(
          (error) => {
            console.log(error)
            throw error
          }
        )
      )
      .subscribe(
        (response) => {
          this.getPortfolioActivityContent(
            this.userId(),
            this.portfolioId()
         );
        }
      )
  }
}
