import { Component } from '@angular/core';
import { GeneralIndexCard } from "./general-index-card/general-index-card";
import { MATERIAL_IMPORTS } from '../../../material-imports';

  export type IndexCardInterface= {
    id: string;
    name: string;
    points: number;
    variation: number;
    percent: number
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
export class IndexesCards {

  INDEXES: IndexCardInterface[] = [
    {id: '^DJI', name: 'Dow Jones', points: 46247.29, variation: 299.97, percent: 0.0065},
    {id: '^GSPC', name: 'S&P 500', points: 6643.70, variation: 38.98, percent: 0.0065},
    {id: '^IXIC', name: 'NASDAQ', points: 22484.07, variation: -99.37, percent: -0.0044},
    {id: '^GSPTSE', name: 'TSX', points: 29761.28, variation: 29.30, percent: 0.0099},
    {id: '^BVSP', name: 'IBOVESPA', points: 145446.66, variation: -140.42, percent: -0.0010},
  ]
}
