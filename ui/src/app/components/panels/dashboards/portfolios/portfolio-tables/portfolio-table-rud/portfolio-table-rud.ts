import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, GeneraliDialog } from '../../../../../dialogs/general-dialog/general-dialog';
import { BuyStockDialog } from '../../../../../dialogs/buy-stock-dialog/buy-stock-dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PortfolioActivityModel } from '../../../../../../models/portfolio-log-model';
import { PortfolioActivityService } from '../../../../../../services/portfolio-activity/portfolio-activity-service';
import { catchError } from 'rxjs';

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
export class PortfolioTableRud  implements OnInit {

  // portfolioId = input.required<string>()
  dialog = inject(MatDialog);

  portfolioActivityService = inject(PortfolioActivityService)

  displayedColumns: string[] = ['symbol_id', 'symbol_name', 'purchase_price', 'quantity', 'purchase_date', 'sell', "delete"];
  dataSource: MatTableDataSource<PortfolioActivityModel> = new MatTableDataSource();

  userId: InputSignal<number> = input.required<number>()
  portfolioId: InputSignal<number> = input.required<number>()

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
        console.log(response)
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
        console.log("Stock bought");
      }
    )
  }

  editRow(element: PortfolioActivityModel) {
    console.log(`editing symbol: ${element.symbol_id}`)
  }

  deleteRow(element: PortfolioActivityModel) {
    console.log(`deleting symbol: ${element.symbol_id}`)
  }
}
