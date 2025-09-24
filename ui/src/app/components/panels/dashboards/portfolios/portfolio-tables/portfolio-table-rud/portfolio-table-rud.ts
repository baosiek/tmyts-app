import { Component, EventEmitter, inject, input, InputSignal, OnChanges, OnInit, Output } from '@angular/core';
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
import { BuyAssetDialog } from '../../../../../dialogs/buy-asset-dialog/buy-asset-dialog';
import { AddIncomeDialog } from '../../../../../dialogs/add-income-dialog/add-income-dialog';
import { SellAssetDialog } from '../../../../../dialogs/sell-asset-dialog/sell-asset-dialog';

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
export class PortfolioTableRud implements OnChanges {

  // portfolioId = input.required<string>()
  dialog = inject(MatDialog);

  portfolioActivityService = inject(PortfolioActivityService)

  displayedColumns: string[] = ['symbol', 'symbol_name', 'purchase_price', 'quantity', 'purchase_date', 'fees', 'cash_in', 'broker_name', 'sell', "delete"];
  dataSource: MatTableDataSource<PortfolioActivityModel> = new MatTableDataSource();

  userId: InputSignal<number> = input.required<number>()
  portfolioId: InputSignal<number> = input.required<number>()

  @Output() portfolioExchangeData = new EventEmitter<PortfolioComponentsDataExchange>();

  portfilioSymbols: string[] = []

  ngOnChanges(): void {
    this.getPortfolioActivityContent(
      this.portfolioId()
    );
  }

  getPortfolioActivityContent(portfolioId: number) {
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

  buyAsset() {
    // Set the attributes to pass to the actual dialog, not the General one
    const data: Map<string, any> = new Map<string, any>()
    data.set('userId', this.userId())
    data.set('portfolioId', this.portfolioId())
    const dialogRef = this.dialog.open(
      GeneraliDialog,
      {
        data: {
          title: "Buy asset",
          content: BuyAssetDialog,
          data: data
        }
      }
    )
    dialogRef.afterClosed().subscribe(
      () => {
        this.getPortfolioActivityContent(
          this.portfolioId()
        );
      }
    )
  }

  sellAsset() {
    // Set the attributes to pass to the actual dialog, not the General one
    const data: Map<string, any> = new Map<string, any>()
    data.set('userId', this.userId())
    data.set('portfolioId', this.portfolioId())
    const dialogRef = this.dialog.open(
      GeneraliDialog,
      {
        data: {
          title: "Sell asset",
          content: SellAssetDialog,
          data: data
        }
      }
    )
    dialogRef.afterClosed().subscribe(
      () => {
        this.getPortfolioActivityContent(
          this.portfolioId()
        );
      }
    )
  }

  addIncome() {
    // Set the attributes to pass to the actual dialog, not the General one
    const data: Map<string, any> = new Map<string, any>()
    data.set('portfolioId', this.portfolioId())
    const dialogRef = this.dialog.open(
      GeneraliDialog,
      {
        data: {
          title: "Add income",
          content: AddIncomeDialog,
          data: data
        }
      }
    )
    dialogRef.afterClosed().subscribe(
      () => {
        this.getPortfolioActivityContent(
          this.portfolioId()
        );
      }
    )
  }

  editRow(element: PortfolioActivityMode) {
    console.log(`editing symbol: ${element.symbol_id}`)
  }

  deleteRow(element: PortfolioActivityModel) {
    const temp = element as PortfolioActivityModel
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
            this.portfolioId()
         );
        }
      )
  }
}
