import { Component, input } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { CurrencyPipe, DecimalPipe, PercentPipe, SlicePipe } from '@angular/common';
import { IndexCardInterface } from '../indexes-cards';

@Component({
  selector: 'app-general-index-card',
  imports: [
    ...MATERIAL_IMPORTS,
    DecimalPipe,
    PercentPipe,
    SlicePipe
  ],
  templateUrl: './general-index-card.html',
  styleUrl: './general-index-card.scss'
})
export class GeneralIndexCard {

  index = input.required<IndexCardInterface>();
}
