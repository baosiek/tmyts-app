import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-general-index-card',
  imports: [
    ...MATERIAL_IMPORTS,
    DecimalPipe
  ],
  templateUrl: './general-index-card.html',
  styleUrl: './general-index-card.scss'
})
export class GeneralIndexCard {

}
