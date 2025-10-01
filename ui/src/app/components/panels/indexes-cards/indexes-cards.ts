import { Component, inject, OnInit } from '@angular/core';
import { GeneralIndexCard } from "./general-index-card/general-index-card";
import { MATERIAL_IMPORTS } from '../../../material-imports';
import { LiveDataService } from '../../../services/live-data/live-data-service';
import { catchError, of, retry } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TmytsSnackbar } from '../../reusable-components/tmyts-snackbar/tmyts-snackbar';

export type IndexCardInterface = {
  id: string;
  name: string;
  points: number;
  variation: number;
  percent: number
}

export type IndexNameType = {
  id: string;
  name: string;
}

@Component({
  selector: 'app-indexes-cards',
  imports: [
    ...MATERIAL_IMPORTS,
    GeneralIndexCard
  ],
  templateUrl: './indexes-cards.html',
  styleUrl: './indexes-cards.scss'
})
export class IndexesCards implements OnInit {

  liveDataService = inject(LiveDataService)

  INDEXES: IndexCardInterface[] = []

  INDEXES_NAME: IndexNameType[] = [
    { id: '^DJI', name: 'Dow Jones' },
    { id: '^GSPC', name: 'S&P 500' },
    { id: '^IXIC', name: 'NASDAQ' },
    { id: '^GSPTSE', name: 'TSX' },
    { id: '^BVSP', name: 'IBOVESPA' },
  ]

  constructor(private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    const indexesList = this.INDEXES_NAME.map(
      row => row.id
    );
    this.liveDataService.getIndexesData(indexesList)
      .pipe(
        // retry(3),
        catchError(
          (error) => {
            // Handle error response
            const message: string = `Error: ${JSON.stringify(error.error.detail)}`;

            // Renders error snack-bar
            this._snackBar.openFromComponent(
              TmytsSnackbar, {
              data: { 'message': message, 'action': 'Close' },
              panelClass: ['error-snackbar-theme']
            }
            );
            return of([]);
          }
        )
      )
      .subscribe(
        {
          next: (response: IndexCardInterface[]) => {

            response.map(item1 => {
              const match = this.INDEXES_NAME.find(item2 => item2.id === item1.id);

              if (match) {
                // If a match is found, replace the `value`
                item1.name = match.name
                return { ...item1 };
              }

              // Otherwise, return the original item
              return item1;
            });

            // console.log(updatedArray)
            response.forEach(row => this.INDEXES.push(row))
          }
        }
      );
  }
}
