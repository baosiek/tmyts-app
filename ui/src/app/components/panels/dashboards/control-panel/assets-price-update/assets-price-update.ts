import { DatePipe, DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, forkJoin, of } from 'rxjs';
import { PortfolioComponentsDataExchange } from '../../../../../interfaces/portfolio-components-data-exchange';
import { MATERIAL_IMPORTS } from '../../../../../material-imports';
import { AssetModel } from '../../../../../models/asset-model';
import { AssetService } from '../../../../../services/asset/asset-service';
import { previousNyseTradingDate, toIsoDateString } from '../../../../../utils/nyse-calendar';
import { TmytsChip } from '../../../../reusable-components/tmyts-chip/tmyts-chip';

@Component({
  selector: 'app-assets-price-update',
  imports: [
    ...MATERIAL_IMPORTS,
    MatSortModule,
    MatPaginatorModule,
    DatePipe,
    DecimalPipe,
    TmytsChip,
  ],
  templateUrl: './assets-price-update.html',
  styleUrl: './assets-price-update.scss',
})
export class AssetsPriceUpdate implements OnChanges, AfterViewInit {

  @Input() dataExchangeFromParent!: PortfolioComponentsDataExchange;

  assetService: AssetService = inject(AssetService);

  spinnerFlagIsSet: boolean = false;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  dataSource: MatTableDataSource<AssetModel> = new MatTableDataSource();

  displayedColumns: string[] = [
    'asset',
    'asset_name',
    'venue',
    'priority',
    'last_download',
  ];

  ngAfterViewInit(): void {
    this.attachTableFeatures();
  }

  private attachTableFeatures(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
    this.dataSource._updateChangeSubscription();
  }

  isUpToDate(lastDownload: string | null): boolean {
    if (!lastDownload) return false;
    const previousMarketDate = toIsoDateString(previousNyseTradingDate(new Date()));
    return lastDownload.slice(0, 10) === previousMarketDate;
  }

  ngOnChanges(): void {
    const assetList = this.dataExchangeFromParent?.asset_list ?? [];

    if (assetList.length > 0) {
      const uniqueAssets = [...new Set(assetList)];
      this.spinnerFlagIsSet = true;
      forkJoin(
        uniqueAssets.map((asset) =>
          this.assetService.getAssetByName(asset).pipe(catchError(() => of(null))),
        ),
      ).subscribe({
        next: (responses) => {
          this.dataSource.data = responses.filter(
            (asset): asset is AssetModel => asset !== null,
          );
          this.attachTableFeatures();
        },
        complete: () => {
          this.spinnerFlagIsSet = false;
        },
      });
    } else {
      this.dataSource.data = [];
    }
  }
}
