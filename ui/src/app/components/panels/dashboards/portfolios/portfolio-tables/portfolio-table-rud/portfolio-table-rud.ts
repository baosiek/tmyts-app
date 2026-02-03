import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  input,
  InputSignal,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError } from 'rxjs';
import { PortfolioComponentsDataExchange } from '../../../../../../interfaces/portfolio-components-data-exchange';
import { MATERIAL_IMPORTS } from '../../../../../../material-imports';
import { PortfolioActivityModel } from '../../../../../../models/portfolio-activity-model';
import { PortfolioActivityService } from '../../../../../../services/portfolio-activity/portfolio-activity-service';
import { AddIncomeDialog } from '../../../../../dialogs/add-income-dialog/add-income-dialog';
import { BuyAssetDialog } from '../../../../../dialogs/buy-asset-dialog/buy-asset-dialog';
import { GeneraliDialog } from '../../../../../dialogs/general-dialog/general-dialog';
import { SellAssetDialog } from '../../../../../dialogs/sell-asset-dialog/sell-asset-dialog';
import { TmytsSnackbar } from '../../../../../reusable-components/tmyts-snackbar/tmyts-snackbar';

@Component({
  selector: 'app-portfolio-table-rud',
  imports: [...MATERIAL_IMPORTS, MatSortModule, DatePipe, CurrencyPipe],
  templateUrl: './portfolio-table-rud.html',
  styleUrl: './portfolio-table-rud.scss',
})
export class PortfolioTableRud implements OnChanges, AfterViewInit {
  dialog = inject(MatDialog);

  portfolioActivityService = inject(PortfolioActivityService);

  displayedColumns: string[] = [
    'id',
    'symbol',
    'symbol_name',
    'purchase_price',
    'quantity',
    'purchase_date',
    'fees',
    'cash_in',
    'broker_name',
    'delete',
  ];
  dataSource: MatTableDataSource<PortfolioActivityModel> =
    new MatTableDataSource();

  userId: InputSignal<number> = input.required<number>();
  portfolioId: InputSignal<number | null> = input.required<number | null>();
  portfilioSymbols: string[] = [];
  spinnerFlagIsSet: boolean = false;

  @Output() portfolioExchangeData =
    new EventEmitter<PortfolioComponentsDataExchange>();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private _snackBar: MatSnackBar) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(): void {
    console.log(`this.portfolioId(): ${this.portfolioId()}`);
    this.getPortfolioActivityContent(this.portfolioId());
  }

  getPortfolioActivityContent(portfolioId: number | null) {
    if (portfolioId) {
      this.spinnerFlagIsSet = true;
      this.portfolioActivityService
        .getActivityForPortfolio(this.userId(), portfolioId)
        .subscribe({
          next: (response: PortfolioActivityModel[]) => {
            // updates datasource
            this.dataSource.data = response;

            // builds list of symbols to send to performance table component
            const symbols: string[] = [];
            response.forEach((item) => {
              symbols.push(item.symbol);
            });
            const dataExchange = PortfolioComponentsDataExchange.create(
              this.userId(),
              this.portfolioId(),
              symbols,
            );
            this.portfolioExchangeData.emit(dataExchange);
          },
          error: (error) => {
            // Handle error response
            const message: string = `Error: ${JSON.stringify(error.error.detail)}`;

            // Renders error snack-bar
            this._snackBar.openFromComponent(TmytsSnackbar, {
              data: { message: message, action: 'Close' },
              panelClass: ['error-snackbar-theme'],
            });
          },
          complete: () => {
            this.spinnerFlagIsSet = false;
          },
        });
    }
  }

  buyAsset() {
    // Set the attributes to pass to the actual dialog, not the General one
    const data: Map<string, any> = new Map<string, any>();
    data.set('userId', this.userId());
    data.set('portfolioId', this.portfolioId());
    const dialogRef = this.dialog.open(GeneraliDialog, {
      data: {
        title: 'Buy asset',
        content: BuyAssetDialog,
        data: data,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPortfolioActivityContent(this.portfolioId());
    });
  }

  sellAsset() {
    // Set the attributes to pass to the actual dialog, not the General one
    const data: Map<string, any> = new Map<string, any>();
    data.set('userId', this.userId());
    data.set('portfolioId', this.portfolioId());
    const dialogRef = this.dialog.open(GeneraliDialog, {
      data: {
        title: 'Sell asset',
        content: SellAssetDialog,
        data: data,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPortfolioActivityContent(this.portfolioId());
    });
  }

  addIncome() {
    // Set the attributes to pass to the actual dialog, not the General one
    const data: Map<string, any> = new Map<string, any>();
    data.set('userId', this.userId());
    data.set('portfolioId', this.portfolioId());
    const dialogRef = this.dialog.open(GeneraliDialog, {
      data: {
        title: 'Add income',
        content: AddIncomeDialog,
        data: data,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPortfolioActivityContent(this.portfolioId());
    });
  }

  deleteRow(id: number) {
    this.portfolioActivityService
      .deleteActivityForPortfolio(id)
      .pipe(
        catchError((error) => {
          throw error;
        }),
      )
      .subscribe((response) => {
        this.getPortfolioActivityContent(this.portfolioId());
      });
  }
}
